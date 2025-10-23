import styled from "@emotion/styled";
import { theme } from "../../styles/theme";

interface CardProps {
  children: React.ReactNode;
  padding?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const StyledCard = styled.div<{ padding: string; hover: boolean }>`
  background: ${theme.colors.background.main};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  padding: ${({ padding }) =>
    theme.spacing[padding as keyof typeof theme.spacing]};
  transition: all 0.2s ease;
  cursor: ${({ hover }) => (hover ? "pointer" : "default")};

  ${({ hover }) =>
    hover &&
    `
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }
  `}
`;

export function Card({
  children,
  padding = "lg",
  hover = false,
  onClick,
  style,
}: CardProps) {
  return (
    <StyledCard padding={padding} hover={hover} onClick={onClick} style={style}>
      {children}
    </StyledCard>
  );
}
