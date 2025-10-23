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
import {
  mockAssignments,
  mockMissions,
  mockScores,
  mockSubmissions,
  mockReviews,
} from "../mock/data";

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

const MissionItem = styled.div<{ completed: boolean }>`
  padding: ${theme.spacing.md};
  border-left: 4px solid
    ${({ completed }) =>
      completed ? theme.colors.success : theme.colors.warning};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.sm};
`;

const AssignmentCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const ScoreChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${theme.spacing.sm};
  height: 150px;
  padding: ${theme.spacing.md} 0;
`;

const ScoreBar = styled.div<{ height: number }>`
  flex: 1;
  background: linear-gradient(
    180deg,
    ${theme.colors.primary},
    ${theme.colors.secondary}
  );
  border-radius: ${theme.borderRadius.sm};
  height: ${({ height }) => height}%;
  min-height: 20px;
  position: relative;

  &:hover::after {
    content: attr(data-score);
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.colors.text.primary};
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
`;

export function StudentDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const avgScore = Math.round(
    mockScores.reduce((a, b) => a + b, 0) / mockScores.length
  );
  const completedMissions = mockMissions.filter((m) => m.completed).length;

  // 평가받은 제출물 찾기
  const evaluatedSubmission = mockSubmissions.find(
    (s) => s.status === "evaluated"
  );
  const latestReview = evaluatedSubmission ? mockReviews[0] : null;

  return (
    <>
      <Header>
        <HeaderContent>
          <Logo>📝 SummaryWrite</Logo>
          <Flex gap="md" align="center">
            <Text style={{ margin: 0 }}>
              안녕하세요, <strong>{user?.name}</strong>님! 👋
            </Text>
            <Button size="small" variant="outline" onClick={handleLogout}>
              로그아웃
            </Button>
          </Flex>
        </HeaderContent>
      </Header>

      <Container>
        <Heading1>📊 내 대시보드</Heading1>

        {/* 통계 카드 */}
        <Grid columns={4} gap="lg" style={{ marginBottom: theme.spacing.xl }}>
          <StatCard>
            <StatValue>{avgScore}점</StatValue>
            <StatLabel>평균 점수</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{mockSubmissions.length}</StatValue>
            <StatLabel>총 제출 과제</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              {completedMissions}/{mockMissions.length}
            </StatValue>
            <StatLabel>완료한 미션</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{mockAssignments.length}</StatValue>
            <StatLabel>진행 중인 과제</StatLabel>
          </StatCard>
        </Grid>

        {/* 최근 첨삭 */}
        {latestReview && (
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
              <Heading2 style={{ margin: 0 }}>🎉 최근 첨삭 결과</Heading2>
              <Badge
                color={
                  latestReview.manualScore >= 80
                    ? theme.colors.success
                    : theme.colors.warning
                }
              >
                {latestReview.manualScore}점
              </Badge>
            </Flex>
            <Text style={{ whiteSpace: "pre-line" }}>
              {latestReview.comments}
            </Text>
            <SmallText>
              {latestReview.teacherName} 선생님 ·{" "}
              {new Date(latestReview.reviewedAt).toLocaleDateString()}
            </SmallText>
          </Card>
        )}

        <Grid columns={2} gap="xl">
          {/* 이번 주 미션 */}
          <div>
            <Heading2>🎯 이번 주 미션</Heading2>
            {mockMissions.map((mission) => (
              <MissionItem key={mission.id} completed={mission.completed}>
                <Flex justify="space-between" align="center">
                  <div>
                    <Text
                      style={{
                        margin: 0,
                        fontWeight: theme.typography.fontWeight.medium,
                      }}
                    >
                      {mission.completed ? "✅ " : "⏳ "}
                      {mission.title}
                    </Text>
                    <SmallText>{mission.description}</SmallText>
                  </div>
                  <SmallText>
                    ~{new Date(mission.dueDate).toLocaleDateString()}
                  </SmallText>
                </Flex>
              </MissionItem>
            ))}
          </div>

          {/* 점수 그래프 */}
          <div>
            <Heading2>📈 최근 점수 추이</Heading2>
            <Card>
              <ScoreChart>
                {mockScores.map((score, idx) => (
                  <ScoreBar
                    key={idx}
                    height={score}
                    data-score={`${score}점`}
                  />
                ))}
              </ScoreChart>
              <Flex
                justify="center"
                gap="sm"
                style={{ marginTop: theme.spacing.md }}
              >
                <SmallText>최근 {mockScores.length}개 과제</SmallText>
              </Flex>
            </Card>
          </div>
        </Grid>

        {/* 과제 목록 */}
        <div style={{ marginTop: theme.spacing.xl }}>
          <Heading2>✍️ 제출 가능한 과제</Heading2>
          <Grid columns={2} gap="lg">
            {mockAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                onClick={() => navigate(`/student/writing/${assignment.id}`)}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  style={{ marginBottom: theme.spacing.sm }}
                >
                  <Heading2
                    style={{
                      margin: 0,
                      fontSize: theme.typography.fontSize.lg,
                    }}
                  >
                    {assignment.title}
                  </Heading2>
                  <Badge>{assignment.grade}학년</Badge>
                </Flex>
                <Text style={{ fontSize: theme.typography.fontSize.sm }}>
                  {assignment.instructions}
                </Text>
                <Flex justify="space-between" align="center">
                  <SmallText>
                    📅 마감:{" "}
                    {new Date(assignment.dueDate!).toLocaleDateString()}
                  </SmallText>
                  <Button size="small">시작하기 →</Button>
                </Flex>
              </AssignmentCard>
            ))}
          </Grid>
        </div>
      </Container>
    </>
  );
}
