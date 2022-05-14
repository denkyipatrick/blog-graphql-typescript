import { createTestContext } from "./__helpers";

const ctx = createTestContext();

it("ensures that a draft can be created and published", async () => {
  const draftResult = await ctx.client.request(`
    mutation {
      createDraft(title: "Nexus", body: "...") {
        id
        title
        body
        published
      }
    }
  `);

  expect(draftResult).toMatchInlineSnapshot(`
Object {
  "createDraft": Object {
    "body": "...",
    "id": "3",
    "published": false,
    "title": "Nexus",
  },
}
`);

  const publishResult = await ctx.client.request(
    `
    mutation publishDraft($draftId: Int!) {
      publish(draftId: $draftId) {
        id
        title
        body
        published
      }
    }
  `,
    { draftId: draftResult.createDraft.id }
  );

  expect(publishResult).toMatchInlineSnapshot();

  const persistedData = await ctx.prisma.post.findMany();
  expect(persistedData).toMatchInlineSnapshot();
});
