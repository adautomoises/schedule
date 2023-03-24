import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;

  gap: 1rem;
  padding: 0 2rem 2rem 2rem;
  overflow-x: hidden;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  gap: 10;
`;

export const Div100 = styled.div`
  width: 100%;
`;

export const Cards = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 20rem);
  justify-content: center;
  gap: 20px 30px;
`;
