((d) => {
    /* settings */
    const defaultBase = 2;
    const bemRoot = "base-calc";

    /* helper functions */
    const _ = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
    const range = (start, stop) => Array(stop - start + 1).fill().map((_, i) => start + i);
    const data = el => (prop, def) => typeof el.dataset[prop] === "undefined" ? def : el.dataset[prop];

    const addClass = (el, cls) => {
        el.classList.add(`${bemRoot}--${cls}`);
        return el;
    };

    const removeChildren = node => {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };

    const createStore = (reducer, initial) => {
        let subscribers = [];
        let state = initial;

        const getState = () => state;

        const subscribe = fn => {
            subscribers = [...subscribers, fn];
        };

        const dispatch = action => {
            state = reducer(state, action);
            subscribers.forEach(fn => fn(state));
        };

        return { getState, subscribe, dispatch };
    };

    /* useful values */
    const defaultChars = [
        ...range(0, 9).map(i => i.toString()), // "0" - "9"
        ...range(97, 122).map(i => String.fromCharCode(i)), // "a" - "z"
    ];

    /* state */
    const limit = state => value => state.values.slice(0, state.base).includes(value) ? value : "0";

    const emptyString = value => value === "" ? "0" : value;

    const charToValue = state => char => state.values.indexOf(char);

    const outputReducer = state => ({
        ...state,
        output: state.sum.reduce((total, [[], [value, mult]]) => total + (value * mult), 0),
    });

    const sumReducer = state => {
        const toChar = charToValue(state);

        return {
            ...state,
            sum: state.inputs.slice().reverse().map((value, index) => (
                [
                    [value, state.base, index],
                    [toChar(value), Math.pow(state.base, index)],
                ]
            )).reverse(),
        };
    };


    const inputsCleaner = state => ({
        ...state,
        inputs: state.inputs.map(limit(state)).map(emptyString),
    });

    const inputsReducer = (state, { values }) => ({
        ...state,
        inputs: values.map(str => str.toLowerCase()),
    });

    const unique = (chars, char) => chars.includes(char) || defaultChars.includes(char) ? chars : chars.concat(char);

    const characters = (state, { characters }) => {
        const valid = Array.from(characters.toLowerCase()).reduce(unique, []);
        const all = defaultChars.concat(valid);

        return {
            ...state,
            base: state.values.length === all.length ? state.base : all.length,
            characters: valid.join(""),
            values: all,
        };
    };

    const hover = (state, { hover }) => ({ ...state, hover });

    // functions that all reducers use
    const normalise = _(outputReducer, sumReducer, inputsCleaner);

    const reducer = (state, action) => {
        switch (action.type) {
            case "go": return normalise(characters(state, { characters: state.characters }));
            case "inputs": return normalise(inputsReducer(state, action));
            case "characters": return normalise(characters(state, action));
            case "hover": return hover(state, action);
            default: return state;
        }
    };

    const create = (root, initial) => {
        const store = createStore(reducer, initial);
        addClass(root, "root");

        /* creating elements */
        // additional characters
        const charactersLabel = d.createElement("label");
        addClass(charactersLabel, "characters-label");
        charactersLabel.textContent = "Additional Characters";

        const characters = d.createElement("input");
        addClass(characters, "characters");

        if (initial.options.showBase) {
            root.append(charactersLabel, characters);
        }

        // base header
        const baseHeader = d.createElement("h4");
        addClass(baseHeader, "base-header");
        root.append(baseHeader);


        // create inputs
        const fieldsContainer = d.createElement("div");
        addClass(fieldsContainer, "input-container");

        const fields = range(1, initial.inputs.length).map(() => {
            const span = d.createElement("span");
            addClass(span, "input");

            const multiplier = d.createElement("p");
            addClass(multiplier, "multiplier");

            const value = d.createElement("p");
            addClass(value, "value");

            const input = d.createElement("input");
            addClass(input, "field");

            span.append(multiplier, value, input);

            return { span, input, value, multiplier };
        });

        const inputs = fields.map(({ input }) => input);

        fields.forEach(({ span }) => fieldsContainer.append(span));
        root.append(fieldsContainer);


        // output
        const sum = d.createElement("p");
        addClass(sum, "sum");

        const sumParsed = d.createElement("p");
        addClass(sumParsed, "sum");

        const output = d.createElement("p");
        addClass(output, "output");

        root.append(sum, sumParsed, output);


        // dictionary
        const dictionaryHeader = d.createElement("h4");
        addClass(dictionaryHeader, "dictionary-header");
        dictionaryHeader.textContent = "Lookup Table";

        const dictionary = d.createElement("ul");
        addClass(dictionary, "dictionary");
        root.append(dictionaryHeader, dictionary);


        /* events */
        const input = (e) => {
            if (inputs.includes(e.target)) {
                store.dispatch({ type: "inputs", values: inputs.map(input => input.value) });
            }

            if (e.target === characters) {
                store.dispatch({ type: "characters", characters: characters.value });
            }
        };

        const hoverOver = e => {
            if (inputs.includes(e.target)) {
                store.dispatch({ type: "hover", hover: inputs.indexOf(e.target) });
            }
        };

        const hoverOut = e => {
            if (inputs.includes(e.target) && e.target !== d.activeElement) {
                store.dispatch({ type: "hover", hover: -1 });
            }
        };

        root.addEventListener("input", input);
        root.addEventListener("mouseover", hoverOver);
        root.addEventListener("mouseout", hoverOut);
        root.addEventListener("focusin", hoverOver);
        root.addEventListener("focusout", hoverOut);


        /* render */
        const numberFormat = new Intl.NumberFormat().format;

        const span = txt => `<span class=${bemRoot}--highlight>${txt}</span>`;
        const noWrap = txt => `<span class=${bemRoot}--no-wrap>${txt}</span>`;

        const highlight = hover => (txt, i) => hover === i ? span(txt) : txt;

        const render = () => {
            let previous = {};

            return state => {
                const highlightFn = highlight(state.hover);

                if (state.hover !== previous.hover || state.base !== previous.base || state.inputs !== previous.inputs) {
                    fields.forEach(({ input, multiplier, value }, index) => {
                        const power = fields.length - index - 1;
                        input.value = state.inputs[index];
                        multiplier.innerHTML = `${state.base}<sup>${power}</sup>`;
                        value.textContent = numberFormat(Math.pow(state.base, power));

                        const method = state.hover === index ? "add" : "remove";
                        input.classList[method](`${bemRoot}--highlight`);
                    });

                    sum.innerHTML = "= " + state.sum.map(([y]) => y).map(([val, base, power]) => `(${val} × ${base}<sup>${ power }</sup>)`).map(highlightFn).map(noWrap).join(" + ");
                    sumParsed.innerHTML = "= " + state.sum.map(([, x]) => x).map(([val, mult]) => `(${val} × ${numberFormat(mult)})`).map(highlightFn).map(noWrap).join(" + ");
                    output.textContent = "= " + numberFormat(state.output);
                }

                // updates base header
                if (state.base !== previous.base) {
                    baseHeader.textContent = `Base ${state.base} to Decimal Converter`;
                }

                if (state.values !== previous.values || state.base !== previous.base) {
                    const display = state.values.slice(10, state.base);
                    const fragment = d.createDocumentFragment();

                    display.forEach((value, i) => {
                        const li = d.createElement("li");
                        li.textContent = `'${value}' = ${i + 10}`;
                        fragment.append(li);
                    });

                    const method = display.length === 0 ? "add" : "remove";
                    dictionaryHeader.classList[method]("hidden");
                    dictionary.classList[method]("hidden");

                    removeChildren(dictionary);
                    dictionary.append(fragment);
                }

                characters.value = state.characters;

                previous = state;
            };
        };

        store.subscribe(render());

        // start everything off
        store.dispatch({ type: "go" });
    };


    // work with DOM
    const setup = element => {
        const ds = data(element);
        const base = ds("base", defaultBase);
        const inputs = Array.from(ds("default", "000000"));
        const characters = ds("characters", "");

        const config = {
            options: {
                showBase: ds("base", 0) === 0,
            },
            inputs: inputs,
            output: 0,
            hover: -1,
            base: base,
            values: defaultChars,
            characters: characters,
            sum: range(0, inputs.length - 1).reverse().map(power => [0, Math.pow(base, power)]),
        };

        create(element, config);
    };

    Array.from(d.getElementsByClassName("js__base")).map(setup);
})(document);
