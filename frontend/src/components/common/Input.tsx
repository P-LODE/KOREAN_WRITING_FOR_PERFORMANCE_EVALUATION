import styled from "@emotion/styled";
import { theme } from "../../styles/theme";

interface InputProps {
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  font-size: ${theme.typography.fontSize.md};
  font-family: ${theme.typography.fontFamily};
  border: 2px solid
    ${({ hasError }) => (hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${theme.borderRadius.md};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ hasError }) =>
      hasError ? theme.colors.error : theme.colors.primary};
  }

  &:disabled {
    background: ${theme.colors.background.secondary};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${theme.colors.text.light};
  }
`;

const ErrorText = styled.span`
  display: block;
  margin-top: 4px;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.error};
`;

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  fullWidth = true,
}: InputProps) {
  return (
    <InputWrapper fullWidth={fullWidth}>
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        hasError={!!error}
        disabled={disabled}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  );
}
