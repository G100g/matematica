import { Route } from "wouter";
import "./App.css";
import { MainMenu } from "./MainMenu";
import { MoltiplicazioniGame } from "./MoltiplicazioniGame";
import { Grid } from "@radix-ui/themes";

function App() {
  return (
    <Grid height={"100%"} width={"100%"}>
      <Route path="/" component={MainMenu} />
      <Route path="/moltiplicazioni/:numero" component={MoltiplicazioniGame} />

      {/* <MoltiplicazioniGame /> */}
    </Grid>
  );
}

export default App;
