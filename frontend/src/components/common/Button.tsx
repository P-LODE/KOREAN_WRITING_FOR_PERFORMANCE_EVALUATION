import styled from "@emotion/styled";
import { theme } from "../../styles/theme";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  padding: ${({ size }) =>
    size === "small"
      ? "8px 16px"
      : size === "large"
      ? "16px 32px"
      : "12px 24px"};
  font-size: ${({ size }) =>
    size === "small"
      ? theme.typography.fontSize.sm
      : size === "large"
      ? theme.typography.fontSize.lg
      : theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.md};
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  font-family: ${theme.typography.fontFamily};

  ${({ variant }) => {
    switch (variant) {
      case "secondary":
        return `
          background: ${theme.colors.secondary};
          color: ${theme.colors.text.white};
          
          &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-1px);
          }
        `;
      case "outline":
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary};
            color: ${theme.colors.text.white};
          }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: ${theme.colors.text.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primaryDark};
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export function Button({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}
