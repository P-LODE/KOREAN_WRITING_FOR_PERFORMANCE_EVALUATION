import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useAuthStore } from "../store/authStore";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Container, Flex, Grid } from "../components/common/Container";
import {
  Heading1,
  Heading2,
  Text,
  Badge,
  SmallText,
} from "../components/common/Typography";
import { theme } from "../styles/theme";
import { mockStudents, mockClass, mockSubmissions } from "../mock/data";

const Header = styled.header`
  background: ${theme.colors.background.main};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.md} 0;
  margin-bottom: ${theme.spacing.xl};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const Logo = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const StudentCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const StudentAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${theme.colors.primary},
    ${theme.colors.secondary}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.xl};
  margin-right: ${theme.spacing.md};
`;

const ScoreCircle = styled.div<{ score: number }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ score }) =>
    score >= 90
      ? theme.colors.success
      : score >= 80
      ? theme.colors.primary
      : theme.colors.warning};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
`;

const SubmissionItem = styled.div`
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.background.light};
    transform: translateX(4px);
  }
`;

export function TeacherDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const avgClassScore = Math.round(
    mockStudents.reduce((sum, s) => sum + s.averageScore, 0) /
      mockStudents.length
  );

  const totalSubmissions = mockStudents.reduce(
    (sum, s) => sum + s.submissionCount,
    0
  );

  const pendingReviews = mockSubmissions.filter(
    (s) => s.status === "submitted"
  ).length;

  return (
    <>
      <Header>
        <HeaderContent>
          <Logo>📝 SummaryWrite</Logo>
          <Flex gap="md" align="center">
            <Text style={{ margin: 0 }}>
              안녕하세요, <strong>{user?.name}</strong> 선생님! 👋
            </Text>
            <Button size="small" variant="outline" onClick={handleLogout}>
              로그아웃
            </Button>
          </Flex>
        </HeaderContent>
      </Header>

      <Container>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: theme.spacing.xl }}
        >
          <Heading1>{mockClass.name} 📚</Heading1>
          <Badge color={theme.colors.secondary}>
            {mockClass.studentCount}명
          </Badge>
        </Flex>

        {/* 통계 카드 */}
        <Grid columns={4} gap="lg" style={{ marginBottom: theme.spacing.xl }}>
          <StatCard>
            <StatValue>{mockClass.studentCount}명</StatValue>
            <StatLabel>전체 학생</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{avgClassScore}점</StatValue>
            <StatLabel>반 평균 점수</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{totalSubmissions}</StatValue>
            <StatLabel>총 제출 과제</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue style={{ color: theme.colors.warning }}>
              {pendingReviews}
            </StatValue>
            <StatLabel>첨삭 대기 중</StatLabel>
          </StatCard>
        </Grid>

        {/* 첨삭 대기 중인 제출물 */}
        {pendingReviews > 0 && (
          <Card
            padding="lg"
            style={{
              marginBottom: theme.spacing.xl,
              background: theme.colors.background.light,
            }}
          >
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: theme.spacing.md }}
            >
              <Heading2 style={{ margin: 0 }}>⏰ 첨삭 대기 중인 과제</Heading2>
              <Badge color={theme.colors.warning}>{pendingReviews}건</Badge>
            </Flex>
            {mockSubmissions
              .filter((s) => s.status === "submitted")
              .map((submission) => {
                const student = mockStudents.find(
                  (s) => s.id === submission.studentId
                );
                return (
                  <SubmissionItem
                    key={submission.id}
                    onClick={() => alert("첨삭 페이지로 이동 (구현 예정)")}
                  >
                    <Flex justify="space-between" align="center">
                      <div>
                        <Text
                          style={{
                            margin: 0,
                            fontWeight: theme.typography.fontWeight.medium,
                          }}
                        >
                          {student?.name} 학생의 제출물
                        </Text>
                        <SmallText>
                          제출일:{" "}
                          {new Date(
                            submission.submittedAt!
                          ).toLocaleDateString()}
                        </SmallText>
                      </div>
                      <Button size="small">첨삭하기 →</Button>
                    </Flex>
                  </SubmissionItem>
                );
              })}
          </Card>
        )}

        <Grid columns={2} gap="xl">
          {/* 우수 학생 */}
          <div>
            <Heading2>🏆 우수 학생 (평균 85점 이상)</Heading2>
            <Grid columns={1} gap="md">
              {mockStudents
                .filter((s) => s.averageScore >= 85)
                .map((student) => (
                  <StudentCard key={student.id}>
                    <Flex align="center" justify="space-between">
                      <Flex align="center">
                        <StudentAvatar>👨‍🎓</StudentAvatar>
                        <div>
                          <Text
                            style={{
                              margin: 0,
                              fontWeight: theme.typography.fontWeight.medium,
                            }}
                          >
                            {student.name}
                          </Text>
                          <SmallText>
                            제출 {student.submissionCount}회 · 최근{" "}
                            {student.lastSubmission
                              ? new Date(
                                  student.lastSubmission
                                ).toLocaleDateString()
                              : "없음"}
                          </SmallText>
                        </div>
                      </Flex>
                      <ScoreCircle score={student.averageScore}>
                        {student.averageScore}
                      </ScoreCircle>
                    </Flex>
                  </StudentCard>
                ))}
            </Grid>
          </div>

          {/* 전체 학생 목록 */}
          <div>
            <Heading2>👥 전체 학생 목록</Heading2>
            <Grid columns={1} gap="md">
              {mockStudents.map((student) => (
                <StudentCard key={student.id}>
                  <Flex align="center" justify="space-between">
                    <Flex align="center">
                      <StudentAvatar>👨‍🎓</StudentAvatar>
                      <div>
                        <Text
                          style={{
                            margin: 0,
                            fontWeight: theme.typography.fontWeight.medium,
                          }}
                        >
                          {student.name}
                        </Text>
                        <SmallText>
                          제출 {student.submissionCount}회 · 평균{" "}
                          {student.averageScore}점
                        </SmallText>
                      </div>
                    </Flex>
                    <Button size="small" variant="outline">
                      상세보기 →
                    </Button>
                  </Flex>
                </StudentCard>
              ))}
            </Grid>
          </div>
        </Grid>
      </Container>
    </>
  );
}
