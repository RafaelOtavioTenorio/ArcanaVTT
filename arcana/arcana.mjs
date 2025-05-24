Hooks.on("preCreateActor", async (actor, data, options, userId) => {
  // Se já tiver um token definido, preserva, mas força actorLink = true
  const tokenData = foundry.utils.mergeObject(
    actor.prototypeToken?.toObject?.() || {},
    { actorLink: true }
  );

  actor.updateSource({ prototypeToken: tokenData });
});