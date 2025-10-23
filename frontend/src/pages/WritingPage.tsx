import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Container, Flex } from "../components/common/Container";
import {
  Heading1,
  Heading2,
  Text,
  SmallText,
  Badge,
} from "../components/common/Typography";
import { theme } from "../styles/theme";
import { mockAssignments } from "../mock/data";

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
  cursor: pointer;
`;

const EditorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const OriginalTextCard = styled(Card)`
  background: ${theme.colors.background.light};
`;

const OriginalText = styled.div`
  font-size: ${theme.typography.fontSize.md};
  line-height: 1.8;
  color: ${theme.colors.text.primary};
  white-space: pre-line;
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.main};
  border-radius: ${theme.borderRadius.md};
  max-height: 500px;
  overflow-y: auto;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.md};
  font-family: ${theme.typography.fontFamily};
  line-height: 1.8;
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const CharCounter = styled.div<{ warning?: boolean }>`
  text-align: right;
  margin-top: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
  color: ${({ warning }) =>
    warning ? theme.colors.error : theme.colors.text.secondary};
  font-weight: ${({ warning }) =>
    warning
      ? theme.typography.fontWeight.medium
      : theme.typography.fontWeight.regular};
`;

const GuideBox = styled.div`
  background: ${theme.colors.background.light};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border-left: 4px solid ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

export function WritingPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const assignment = mockAssignments.find((a) => a.id === assignmentId);

  const [summaryText, setSummaryText] = useState("");

  if (!assignment) {
    return (
      <Container>
        <Text>과제를 찾을 수 없습니다.</Text>
        <Button onClick={() => navigate("/student/dashboard")}>돌아가기</Button>
      </Container>
    );
  }

  const charCount = summaryText.length;
  const sentenceCount = summaryText
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0).length;

  const isCharOverLimit =
    assignment.wordLimit && charCount > assignment.wordLimit;
  const isSentenceOverLimit =
    assignment.sentenceLimit && sentenceCount > assignment.sentenceLimit;

  const handleSubmit = () => {
    if (!summaryText.trim()) {
      alert("요약문을 작성해주세요!");
      return;
    }

    if (isCharOverLimit || isSentenceOverLimit) {
      alert("글자 수 또는 문장 수 제한을 확인해주세요!");
      return;
    }

    alert("제출이 완료되었습니다! 🎉");
    navigate("/student/dashboard");
  };

  const handleSaveDraft = () => {
    alert("임시저장 되었습니다! 💾");
  };

  return (
    <>
      <Header>
        <HeaderContent>
          <Logo onClick={() => navigate("/student/dashboard")}>
            📝 SummaryWrite
          </Logo>
          <Flex gap="sm">
            <Button size="small" variant="outline" onClick={handleSaveDraft}>
              💾 임시저장
            </Button>
            <Button
              size="small"
              variant="outline"
              onClick={() => navigate("/student/dashboard")}
            >
              ← 돌아가기
            </Button>
          </Flex>
        </HeaderContent>
      </Header>

      <Container>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: theme.spacing.md }}
        >
          <Heading1 style={{ margin: 0 }}>{assignment.title}</Heading1>
          <Badge>{assignment.grade}학년</Badge>
        </Flex>

        <GuideBox>
          <Text style={{ margin: 0 }}>
            <strong>📝 과제 지시사항:</strong> {assignment.instructions}
          </Text>
        </GuideBox>

        <Flex gap="sm" style={{ marginBottom: theme.spacing.lg }}>
          {assignment.wordLimit && (
            <SmallText>
              📏 글자 수 제한: {assignment.wordLimit}자 이내
            </SmallText>
          )}
          {assignment.sentenceLimit && (
            <SmallText>
              💬 문장 수 제한: {assignment.sentenceLimit}문장 이내
            </SmallText>
          )}
          {assignment.dueDate && (
            <SmallText>
              📅 마감일: {new Date(assignment.dueDate).toLocaleDateString()}
            </SmallText>
          )}
        </Flex>

        <EditorGrid>
          {/* 원본 지문 */}
          <OriginalTextCard>
            <Heading2>📖 원본 지문</Heading2>
            <OriginalText>{assignment.originalText}</OriginalText>
          </OriginalTextCard>

          {/* 요약문 작성 */}
          <Card>
            <Heading2>✍️ 요약문 작성</Heading2>
            <Textarea
              placeholder="여기에 요약문을 작성하세요..."
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
            />
            <CharCounter warning={isCharOverLimit || isSentenceOverLimit}>
              {assignment.wordLimit && (
                <span>
                  글자 수: {charCount} / {assignment.wordLimit}
                  {isCharOverLimit && " ⚠️"}
                </span>
              )}
              {assignment.wordLimit && assignment.sentenceLimit && " | "}
              {assignment.sentenceLimit && (
                <span>
                  문장 수: {sentenceCount} / {assignment.sentenceLimit}
                  {isSentenceOverLimit && " ⚠️"}
                </span>
              )}
            </CharCounter>

            <Flex gap="md" style={{ marginTop: theme.spacing.lg }}>
              <Button fullWidth onClick={handleSubmit}>
                제출하기 🚀
              </Button>
            </Flex>

            {/* 작성 팁 */}
            <GuideBox style={{ marginTop: theme.spacing.lg }}>
              <strong>💡 요약 작성 팁:</strong>
              <ul style={{ marginLeft: "20px", marginTop: theme.spacing.sm }}>
                <li>중심 내용만 간추려 작성하세요</li>
                <li>자신의 말로 바꿔 표현하세요</li>
                <li>불필요한 세부 내용은 제외하세요</li>
                <li>문장을 자연스럽게 연결하세요</li>
              </ul>
            </GuideBox>
          </Card>
        </EditorGrid>
      </Container>
    </>
  );
}
