# ⚙️ SummaryWrite Backend 설계

## 기술 스택

- **NestJS** - Node.js 프레임워크
- **TypeScript** - 타입 안전성
- **Supabase** - PostgreSQL 데이터베이스 + 인증
- **Express** - HTTP 서버
- **Class Validator** - DTO 검증
- **JWT** - 인증 토큰

---

## 🏗️ 아키텍처 패턴

### Layered Architecture

```
Controller Layer (HTTP 요청 처리)
    ↓
Service Layer (비즈니스 로직)
    ↓
Repository Layer (데이터 접근)
    ↓
Database (Supabase PostgreSQL)
```

---

## 📂 모듈 구조

### 1. Auth Module (`/modules/auth`)

```typescript
// auth.controller.ts
@Controller("auth")
export class AuthController {
  @Post("signup")
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("refresh")
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }
}

// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly supabaseClient: SupabaseClient
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponse> {
    // Supabase Auth를 사용한 회원가입
    const { data, error } = await this.supabaseClient.auth.signUp({
      email: signupDto.email,
      password: signupDto.password,
    });

    if (error) throw new BadRequestException(error.message);

    // 추가 사용자 정보 저장
    const user = await this.usersService.create({
      id: data.user.id,
      email: signupDto.email,
      name: signupDto.name,
      role: signupDto.role,
      grade: signupDto.grade,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (error)
      throw new UnauthorizedException("잘못된 이메일 또는 비밀번호입니다");

    const user = await this.usersService.findById(data.user.id);
    const token = this.generateToken(user);

    return { user, token };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}

// DTOs
export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(["student", "teacher"])
  role: "student" | "teacher";

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  grade?: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

---

### 2. Users Module (`/modules/users`)

```typescript
// users.controller.ts
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  @Get(":id")
  async getUser(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Patch(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() updateDto: UpdateUserDto,
    @CurrentUser() user: User
  ) {
    // 본인 또는 교사만 수정 가능
    if (user.id !== id && user.role !== "teacher") {
      throw new ForbiddenException();
    }
    return this.usersService.update(id, updateDto);
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("사용자를 찾을 수 없습니다");
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: CreateUserData): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }
}
```

---

### 3. Learning Module (`/modules/learning`)

```typescript
// learning.controller.ts
@Controller("learning")
@UseGuards(JwtAuthGuard)
export class LearningController {
  @Get("materials")
  async getMaterials(@Query() query: GetMaterialsDto) {
    return this.learningService.getMaterials(query);
  }

  @Get("materials/:id")
  async getMaterial(@Param("id") id: string) {
    return this.learningService.getMaterialById(id);
  }

  @Post("progress")
  async updateProgress(
    @CurrentUser() user: User,
    @Body() progressDto: UpdateProgressDto
  ) {
    return this.learningService.updateProgress(user.id, progressDto);
  }

  @Get("progress")
  async getProgress(@CurrentUser() user: User) {
    return this.learningService.getProgressByStudent(user.id);
  }
}

// learning.service.ts
@Injectable()
export class LearningService {
  constructor(
    @InjectRepository(LearningMaterial)
    private readonly materialRepository: Repository<LearningMaterial>,
    @InjectRepository(LearningProgress)
    private readonly progressRepository: Repository<LearningProgress>
  ) {}

  async getMaterials(query: GetMaterialsDto): Promise<LearningMaterial[]> {
    const { grade, topic } = query;

    return this.materialRepository.find({
      where: {
        isPublished: true,
        ...(grade && { grade }),
        ...(topic && { topic }),
      },
      order: { orderIndex: "ASC" },
    });
  }

  async updateProgress(
    studentId: string,
    progressDto: UpdateProgressDto
  ): Promise<LearningProgress> {
    const { materialId, completed, score } = progressDto;

    let progress = await this.progressRepository.findOne({
      where: { studentId, materialId },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        studentId,
        materialId,
        completed,
        score,
        completedAt: completed ? new Date() : null,
      });
    } else {
      progress.completed = completed;
      progress.score = score;
      if (completed && !progress.completedAt) {
        progress.completedAt = new Date();
      }
    }

    return this.progressRepository.save(progress);
  }
}

// DTOs
export class GetMaterialsDto {
  @IsOptional()
  @IsInt()
  grade?: number;

  @IsOptional()
  @IsString()
  topic?: string;
}

export class UpdateProgressDto {
  @IsUUID()
  materialId: string;

  @IsBoolean()
  completed: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number;
}
```

---

### 4. Summary Module (`/modules/summary`)

```typescript
// summary.controller.ts (글쓰기 과제 관련)
@Controller("writing")
@UseGuards(JwtAuthGuard)
export class SummaryController {
  // 과제 목록 조회
  @Get("assignments")
  async getAssignments(
    @CurrentUser() user: User,
    @Query() query: GetAssignmentsDto
  ) {
    if (user.role === "student") {
      return this.summaryService.getAssignmentsForStudent(user);
    } else {
      return this.summaryService.getAssignmentsByTeacher(user.id);
    }
  }

  // 과제 생성 (교사만)
  @Post("assignments")
  @UseGuards(RoleGuard(["teacher"]))
  async createAssignment(
    @CurrentUser() teacher: User,
    @Body() createDto: CreateAssignmentDto
  ) {
    return this.summaryService.createAssignment(teacher.id, createDto);
  }

  // 제출물 제출 (학생)
  @Post("submissions")
  async submitSummary(
    @CurrentUser() student: User,
    @Body() submitDto: SubmitSummaryDto
  ) {
    return this.summaryService.submitSummary(student.id, submitDto);
  }

  // 제출물 목록 조회
  @Get("submissions")
  async getSubmissions(
    @CurrentUser() user: User,
    @Query() query: GetSubmissionsDto
  ) {
    if (user.role === "student") {
      return this.summaryService.getSubmissionsByStudent(user.id);
    } else {
      return this.summaryService.getSubmissionsForReview(user.id, query);
    }
  }
}

// summary.service.ts
@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>
  ) {}

  async createAssignment(
    teacherId: string,
    createDto: CreateAssignmentDto
  ): Promise<Assignment> {
    const assignment = this.assignmentRepository.create({
      ...createDto,
      createdBy: teacherId,
    });

    return this.assignmentRepository.save(assignment);
  }

  async getAssignmentsForStudent(student: User): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      where: [
        { classId: student.classId, isPublished: true },
        { classId: IsNull(), isPublished: true, grade: student.grade },
      ],
      order: { createdAt: "DESC" },
    });
  }

  async submitSummary(
    studentId: string,
    submitDto: SubmitSummaryDto
  ): Promise<Submission> {
    const { assignmentId, summaryText } = submitDto;

    // 기존 제출물 확인
    let submission = await this.submissionRepository.findOne({
      where: { assignmentId, studentId },
    });

    if (submission) {
      // 업데이트
      submission.summaryText = summaryText;
      submission.status = "submitted";
      submission.submittedAt = new Date();
    } else {
      // 새로 생성
      submission = this.submissionRepository.create({
        assignmentId,
        studentId,
        summaryText,
        status: "submitted",
        submittedAt: new Date(),
      });
    }

    return this.submissionRepository.save(submission);
  }

  async getSubmissionsForReview(
    teacherId: string,
    query: GetSubmissionsDto
  ): Promise<Submission[]> {
    // 교사가 담당하는 반의 학생들 제출물만 조회
    const qb = this.submissionRepository
      .createQueryBuilder("submission")
      .leftJoinAndSelect("submission.student", "student")
      .leftJoinAndSelect("submission.assignment", "assignment")
      .leftJoin("student.class", "class")
      .where("class.teacherId = :teacherId", { teacherId });

    if (query.status) {
      qb.andWhere("submission.status = :status", { status: query.status });
    }

    return qb.orderBy("submission.submittedAt", "DESC").getMany();
  }
}

// DTOs
export class CreateAssignmentDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(10)
  originalText: string;

  @IsString()
  instructions: string;

  @IsOptional()
  @IsInt()
  grade?: number;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @IsInt()
  wordLimit?: number;

  @IsOptional()
  @IsInt()
  sentenceLimit?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class SubmitSummaryDto {
  @IsUUID()
  assignmentId: string;

  @IsString()
  @MinLength(10)
  summaryText: string;
}
```

---

### 5. Evaluation Module (`/modules/evaluation`)

```typescript
// evaluation.controller.ts
@Controller("evaluation")
@UseGuards(JwtAuthGuard)
export class EvaluationController {
  // 교사 첨삭 작성
  @Post("review")
  @UseGuards(RoleGuard(["teacher"]))
  async createReview(
    @CurrentUser() teacher: User,
    @Body() reviewDto: CreateReviewDto
  ) {
    return this.evaluationService.createReview(teacher.id, reviewDto);
  }

  // 평가 결과 조회
  @Get("results")
  async getResults(@CurrentUser() user: User, @Query() query: GetResultsDto) {
    if (user.role === "student") {
      return this.evaluationService.getResultsByStudent(user.id, query);
    } else {
      return this.evaluationService.getResultsByClass(user.id, query);
    }
  }

  // 제출물별 상세 평가
  @Get("submission/:id")
  async getSubmissionReview(@Param("id") submissionId: string) {
    return this.evaluationService.getReviewBySubmission(submissionId);
  }
}

// evaluation.service.ts
@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(TeacherReview)
    private readonly reviewRepository: Repository<TeacherReview>,
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>
  ) {}

  async createReview(
    teacherId: string,
    reviewDto: CreateReviewDto
  ): Promise<TeacherReview> {
    const { submissionId, manualScore, comments, highlights } = reviewDto;

    // 제출물 상태 업데이트
    await this.submissionRepository.update(submissionId, {
      status: "evaluated",
    });

    const review = this.reviewRepository.create({
      submissionId,
      teacherId,
      manualScore,
      comments,
      highlights,
    });

    return this.reviewRepository.save(review);
  }

  async getResultsByStudent(
    studentId: string,
    query: GetResultsDto
  ): Promise<EvaluationResult[]> {
    const { from, to } = query;

    const qb = this.reviewRepository
      .createQueryBuilder("review")
      .leftJoinAndSelect("review.submission", "submission")
      .leftJoinAndSelect("submission.assignment", "assignment")
      .where("submission.studentId = :studentId", { studentId });

    if (from) {
      qb.andWhere("review.reviewedAt >= :from", { from });
    }
    if (to) {
      qb.andWhere("review.reviewedAt <= :to", { to });
    }

    const reviews = await qb.orderBy("review.reviewedAt", "DESC").getMany();

    // 통계 계산
    const statistics = this.calculateStatistics(reviews);

    return {
      results: reviews,
      statistics,
    };
  }

  private calculateStatistics(reviews: TeacherReview[]): Statistics {
    if (reviews.length === 0) {
      return { average: 0, highest: 0, lowest: 0, totalSubmissions: 0 };
    }

    const scores = reviews.map((r) => r.manualScore);
    return {
      average: scores.reduce((a, b) => a + b, 0) / scores.length,
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
      totalSubmissions: reviews.length,
    };
  }
}

// DTOs
export class CreateReviewDto {
  @IsUUID()
  submissionId: string;

  @IsInt()
  @Min(0)
  @Max(100)
  manualScore: number;

  @IsString()
  @MinLength(10)
  comments: string;

  @IsOptional()
  highlights?: any;
}

export class GetResultsDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
```

---

## 🔐 Guards & Decorators

### JWT Auth Guard

```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException("인증이 필요합니다");
    }
    return user;
  }
}
```

### Role Guard

```typescript
// role.guard.ts
export const RoleGuard = (roles: string[]) => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user || !roles.includes(user.role)) {
        throw new ForbiddenException("권한이 없습니다");
      }

      return true;
    }
  }

  return mixin(RoleGuardMixin);
};
```

### Current User Decorator

```typescript
// current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
```

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-supabase-key

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 🧪 테스트

### Unit Tests

```typescript
// summary.service.spec.ts
describe("SummaryService", () => {
  let service: SummaryService;
  let assignmentRepo: Repository<Assignment>;
  let submissionRepo: Repository<Submission>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SummaryService,
        {
          provide: getRepositoryToken(Assignment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Submission),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SummaryService>(SummaryService);
    assignmentRepo = module.get(getRepositoryToken(Assignment));
    submissionRepo = module.get(getRepositoryToken(Submission));
  });

  it("should create an assignment", async () => {
    // 테스트 로직
  });
});
```

---

## 📊 Logging & Monitoring

```typescript
// logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const delay = Date.now() - now;

        this.logger.log(`${method} ${url} ${statusCode} ${delay}ms`);
      })
    );
  }
}
```

---

## 🚀 배포 설정

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
```
