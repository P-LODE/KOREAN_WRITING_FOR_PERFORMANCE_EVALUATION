import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Card } from "../components/common/Card";
import { Heading1, Text } from "../components/common/Typography";
import { Flex } from "../components/common/Container";
import { theme } from "../styles/theme";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.secondary} 100%
  );
  padding: ${theme.spacing.lg};
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};

  h1 {
    color: ${theme.colors.text.white};
    font-size: ${theme.typography.fontSize.xxl};
    margin-bottom: ${theme.spacing.sm};
  }

  p {
    color: ${theme.colors.text.white};
    opacity: 0.9;
  }
`;

const RoleButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const RoleButton = styled.button<{ active: boolean }>`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${({ active }) =>
    active ? theme.colors.primary : theme.colors.background.main};
  color: ${({ active }) =>
    active ? theme.colors.text.white : theme.colors.text.primary};
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 목 로그인
    const mockEmail =
      role === "student" ? "student@test.com" : "teacher@test.com";
    login(mockEmail, password);

    // 역할에 따라 리다이렉트
    if (role === "student") {
      navigate("/student/dashboard");
    } else {
      navigate("/teacher/dashboard");
    }
  };

  const quickLogin = () => {
    const mockEmail =
      role === "student" ? "student@test.com" : "teacher@test.com";
    setEmail(mockEmail);
    setPassword("password123");
    login(mockEmail, "password123");

    setTimeout(() => {
      if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/teacher/dashboard");
      }
    }, 100);
  };

  return (
    <PageWrapper>
      <LoginCard>
        <Logo>
          <h1>📝 SummaryWrite</h1>
          <p>초등 요약 글쓰기 학습 플랫폼</p>
        </Logo>

        <Card padding="xl">
          <Heading1
            style={{
              fontSize: theme.typography.fontSize.xl,
              textAlign: "center",
            }}
          >
            로그인
          </Heading1>

          <RoleButtons>
            <RoleButton
              active={role === "student"}
              onClick={() => setRole("student")}
            >
              🎓 학생
            </RoleButton>
            <RoleButton
              active={role === "teacher"}
              onClick={() => setRole("teacher")}
            >
              👩‍🏫 교사
            </RoleButton>
          </RoleButtons>

          <Flex direction="column" gap="md">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={setEmail}
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={setPassword}
            />
            <Button fullWidth onClick={handleLogin}>
              로그인
            </Button>
            <Button fullWidth variant="outline" onClick={quickLogin}>
              🚀 빠른 로그인 (데모)
            </Button>
          </Flex>

          <Text
            style={{
              marginTop: theme.spacing.md,
              textAlign: "center",
              fontSize: theme.typography.fontSize.sm,
            }}
          >
            데모 계정:{" "}
            {role === "student" ? "student@test.com" : "teacher@test.com"}
          </Text>
        </Card>
      </LoginCard>
    </PageWrapper>
  );
}
