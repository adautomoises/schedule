import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Header = styled.div`
  width: 300px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  div {
    width: 100%;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    margin-bottom: 2rem;
  }

  margin-bottom: 4rem;
`;

export const FormContainer = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
`;
