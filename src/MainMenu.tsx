import { Card, Flex, Grid, Link, Text } from "@radix-ui/themes";
import { Link as RouterLink } from "wouter";

export const MainMenu = () => {
  return (
    <Flex gap={"4"} m="4" direction={"column"}>
      <Text size={"8"} align={"center"}>
        Scegli il gioco
      </Text>

      <Grid gap={"2"} columns={"2"} flexGrow={"1"}>
        {Array.from(Array(8).keys())
          .map((v) => v + 2)
          .map((v) => {
            return (
              <Card>
                <Link asChild>
                  <RouterLink href={`/moltiplicazioni/${v}`}>
                    Tabellina del {v}
                  </RouterLink>
                </Link>
              </Card>
            );
          })}
      </Grid>
    </Flex>
  );
};
