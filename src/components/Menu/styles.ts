import styled from "styled-components";

export const Container = styled.div`
  min-width: 300px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.background};
  border-right: 1px dashed lightgray;
`;

export const Logo = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  margin: 1rem;
  margin-bottom: 2rem;
`;

export const Actions = styled.div`
  width: 100%;

  height: 100vh;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;
