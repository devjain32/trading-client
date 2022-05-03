import React from "react";
import { Container, Paper, styled } from "@mui/material";
import Masonry from "@mui/lab/Masonry";

class Home extends React.Component {
  render() {
    const heights = [
      150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80,
    ];
    const Item = styled(Paper)(({ theme }) => ({
      ...theme.typography.body2,
      color: theme.palette.text.secondary,
      border: "1px solid black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }));
    return (
      <Container maxWidth="xl">
        {/* <Masonry columns={4} spacing={1}>
          {heights.map((height, index) => (
            <Item key={index} sx={{ height }}>
              {index + 1}
            </Item>
          ))}
        </Masonry> */}
        <div
          style={{
            width: "100%",
            height: "100vh-64px",
            backgroundColor: "red",
          }}
        >
          Hello
        </div>
      </Container>
    );
  }
}

export default Home;
