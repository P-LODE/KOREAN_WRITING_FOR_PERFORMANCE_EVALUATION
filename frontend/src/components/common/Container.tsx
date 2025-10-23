import styled from "@emotion/styled";
import { theme } from "../../styles/theme";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

export const Flex = styled.div<{
  direction?: "row" | "column";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  gap?: keyof typeof theme.spacing;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction }) => direction || "row"};
  justify-content: ${({ justify }) => justify || "flex-start"};
  align-items: ${({ align }) => align || "stretch"};
  gap: ${({ gap }) => (gap ? theme.spacing[gap] : 0)};
  flex-wrap: ${({ wrap }) => (wrap ? "wrap" : "nowrap")};
`;

export const Grid = styled.div<{
  columns?: number;
  gap?: keyof typeof theme.spacing;
}>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 1}, 1fr);
  gap: ${({ gap }) => (gap ? theme.spacing[gap] : theme.spacing.md)};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(
      ${({ columns }) => Math.max(1, (columns || 1) - 1)},
      1fr
    );
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;
