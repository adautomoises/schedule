import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

export const FormContainer = styled.div`
  padding: 2rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const Header = styled.div`
  width: 100%;
  height: 100px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 1rem;
  margin: 1rem 0;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
