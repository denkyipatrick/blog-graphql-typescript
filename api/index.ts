import { server } from "./server";

server.listen(3500).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
