class ArcanaCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["arcana", "sheet", "actor"],
      template: "systems/arcana/templates/actor-sheet.html",
      width: 1200,
      height: 900,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  getData() {
    const data = super.getData();
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    this.updateAttributeDisplays(html);

    html.find("input[type='number']").on("input", (event) => {
      const input = event.currentTarget;
      const attributeName = input.name.split(".").pop();
      const displayElement = html.find(`.${attributeName}Attr`);

      if (displayElement.length) {
        const valor = parseInt(input.value);
        displayElement.text(this.calcularModificador(valor));
      }

      this.updateAttributeDisplays(html);
    });
  }

  calcularModificador(valor) {
    if (valor >= 0) {
      return Math.floor(valor / 2);
    } else if (valor >= -5) {
      return valor;
    } else {
      return "Morto";
    }
  }

  updateAttributeDisplays(html) {
    const atributos = {};

    // Atualiza todos os modificadores de atributos
    html.find("input[type='number']").each((_, input) => {
      const $input = $(input);
      const valor = parseInt($input.val());
      const attributeName = input.name.split(".").pop();
      const displayElement = html.find(`.${attributeName}Attr`);

      if (displayElement.length) {
        const modificador = this.calcularModificador(valor);
        displayElement.text(modificador);
        atributos[attributeName] = modificador;
      }
    });

    // Atualiza total das perícias
    html.find(".periciaRow").each((_, el) => {
      const wrapper = $(el);
      const treinamento = parseInt(wrapper.find(".treinamento").val()) || 0;
      const bonus = parseInt(wrapper.find(".bonus").val()) || 0;

      const atributoNome = wrapper.data("atributo"); // ex: "forca", "inteligencia", etc.
      const atributoValor = atributos[atributoNome] ?? 0;

      const total = treinamento + atributoValor + bonus;
      wrapper.find(".total").text(isNaN(total) ? "--" : total);
    });
  }
}

Actors.registerSheet("arcana", ArcanaCharacterSheet, { makeDefault: true });
