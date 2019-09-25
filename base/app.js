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

    const emptyString = value => {
        const trimmed = value.trim();
        return trimmed === "" ? "0" : trimmed;
    };

    const charToValue = state => char => state.values.indexOf(char);

    const outputReducer = state => ({
        ...state,
        output: state.sum.reduce((total, [value, mult]) => total + (value * mult), 0),
    });

    const sumReducer = state => ({
        ...state,
        sum: state.inputs.map(charToValue(state)).reverse().map((value, index) => (
            [value, Math.pow(state.base, index)]
        )).reverse(),
    });

    const inputsCleaner = state => ({
        ...state,
        inputs: state.inputs.map(limit(state)).map(emptyString),
    });

    const inputsReducer = (state, { values }) => ({
        ...state,
        inputs: values,
    });

    const unique = (chars, char) => chars.includes(char) || defaultChars.includes(char) ? chars : chars.concat(char);

    const characters = (state, { characters }) => {
        const valid = Array.from(characters).reduce(unique, []);
        const all = defaultChars.concat(valid);

        return {
            ...state,
            base: state.values.length === all.length ? state.base : all.length,
            characters: valid.join(""),
            values: all,
        };
    };

    const baseReducer = (state, { base }) => ({ ...state, base });

    // functions that all reducers use
    const normalise = _(outputReducer, sumReducer, inputsCleaner);

    const reducer = (state, action) => {
        switch (action.type) {
            case "go": return normalise(state);
            case "base": return normalise(baseReducer(state, action));
            case "inputs": return normalise(inputsReducer(state, action));
            case "characters": return characters(state, action);
            default: return state;
        }
    };

    const create = (root, initial) => {
        const store = createStore(reducer, initial);
        addClass(root, "root");

        /* creating elements */
        // base dropdown
        const baseLabel = d.createElement("label");
        baseLabel.textContent = "Base";

        const select = d.createElement("select");
        addClass(select, "select");

        if (initial.options.showBase) {
            root.append(baseLabel, select);
        }


        // additional characters
        const charactersLabel = d.createElement("label");
        charactersLabel.textContent = "Additional Characters";

        const characters = d.createElement("input");

        if (initial.options.showBase) {
            root.append(charactersLabel, characters);
        }


        // create inputs
        const fieldsContainer = d.createElement("div");
        addClass(fieldsContainer, "input-container");

        const fields = range(1, initial.inputs.length).map(() => {
            const span = d.createElement("span");
            addClass(span, "input");

            const input = d.createElement("input");
            addClass(input, "field");

            const value = d.createElement("p");
            const multiplier = d.createElement("p");
            const sum = d.createElement("p");

            span.append(multiplier, value, input, sum);

            return { span, input, value, multiplier, sum };
        });

        const inputs = fields.map(({ input }) => input);

        fields.forEach(({ span }) => fieldsContainer.append(span));
        root.append(fieldsContainer);


        // output
        const sum = d.createElement("p");
        addClass(sum, "sum");

        const output = d.createElement("p");
        addClass(output, "output");

        root.append(sum, output);


        /* events */
        const input = (e) => {
            if (inputs.includes(e.target)) {
                store.dispatch({ type: "inputs", values: inputs.map(input => input.value) });
            }

            if (e.target === select) {
                store.dispatch({ type: "base", base: +select.value });
            }

            if (e.target === characters) {
                store.dispatch({ type: "characters", characters: characters.value });
            }
        };

        const focus = (e) => {
            if (inputs.includes(e.target)) {
                e.target.select();
            }
        };

        root.addEventListener("input", input);
        root.addEventListener("focusin", focus);


        /* render */
        const numberFormat = new Intl.NumberFormat().format;

        const createOption = base => val => {
            const opt = d.createElement("option");
            opt.textContent = val;
            opt.value = val;

            if (base === val) {
                opt.setAttribute("selected", "selected");
            }

            return opt;
        };

        const render = () => {
            let previous = {};

            return state => {
                if (state.inputs !== previous.inputs) {
                    fields.forEach(({ input, multiplier, value, sum }, index) => {
                        const power = fields.length - index - 1;
                        input.value = state.inputs[index];
                        multiplier.innerHTML = `${state.base}<sup>${power}</sup>`;
                        value.textContent = numberFormat(Math.pow(state.base, power));
                        sum.textContent = `${state.sum[index][0]}×${numberFormat(state.sum[index][1])}`;
                    });

                    sum.textContent = "= " + state.sum.map(([val, mult]) => `(${val}×${numberFormat(mult)})`).join(" + ");
                    output.textContent = "= " + numberFormat(state.output);
                }

                // updates bases select
                if (initial.options.showBase && state.values !== previous.values) {
                    removeChildren(select);
                    state.values.map((_, index) => index + 1).filter(val => val > 1).map(createOption(state.base)).forEach(select.append.bind(select));
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

        const config = {
            options: {
                showBase: ds("base", 0) === 0,
            },
            inputs: inputs,
            output: 0,
            base: base,
            values: defaultChars,
            characters: "",
            sum: range(0, inputs.length - 1).reverse().map(power => [0, Math.pow(base, power)]),
        };

        create(element, config);
    };

    Array.from(d.getElementsByClassName("js__base")).map(setup);
})(document);
