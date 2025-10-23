import styled from "@emotion/styled";
import { theme } from "../../styles/theme";

export const Heading1 = styled.h1`
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.lg} 0;
`;

export const Heading2 = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md} 0;
`;

export const Heading3 = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

export const Text = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.primary};
  line-height: 1.6;
  margin: 0 0 ${theme.spacing.md} 0;
`;

export const SmallText = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

export const Badge = styled.span<{ color?: string }>`
  display: inline-block;
  padding: 4px 12px;
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.full};
  background: ${({ color }) => color || theme.colors.primary};
  color: ${theme.colors.text.white};
`;
