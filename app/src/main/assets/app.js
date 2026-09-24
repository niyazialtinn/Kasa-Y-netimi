const STORAGE_KEY = "kasa-v1";

let state = JSON.parse(
    localStorage.getItem(STORAGE_KEY) ||
    '{"start":20000,"entries":[]}'
);

let selectedResult = "KAZANDI";

const $ = id => document.getElementById(id);

function money(value) {
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value) + " TL";
}

function currentBank() {
    if (state.entries.length === 0) {
        return state.start;
    }

    return state.entries[state.entries.length - 1].end;
}

function saveData() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}

function render() {

    const bank = currentBank();
    const profit = bank - state.start;

    $("bank").textContent =
        "Güncel Kasa: " + money(bank);

    $("profit").textContent =
        "Kâr/Zarar: " + money(profit);

    const risk =
        parseFloat($("risk").value) || 0;

    const stake =
        bank * risk / 100;

    $("stake").textContent =
        money(stake);

    const history =
        $("history");

    if (state.entries.length === 0) {

        history.innerHTML =
            "<p>Henüz kayıt yok.</p>";

        return;
    }

    history.innerHTML =
        [...state.entries]
        .reverse()
        .map(entry => {

            const resultClass =
                entry.result === "FİRE"
                ? "fire"
                : "win";

            return `
                <div class="item">

                    <b>
                        Gün ${entry.day}
                        —
                        <span class="${resultClass}">
                            ${entry.result}
                        </span>
                    </b>

                    <br>

                    Risk:
                    %${entry.risk}

                    <br>

                    Oynanan:
                    ${money(entry.stake)}

                    <br>

                    Oran:
                    ${entry.odds}

                    <br>

                    Kâr/Zarar:
                    ${money(entry.profitLoss)}

                    <br>

                    <strong>
                        Gün Sonu:
                        ${money(entry.end)}
                    </strong>

                </div>
            `;
        })
        .join("");
}

$("risk").addEventListener(
    "input",
    render
);

document
.querySelectorAll(".choice")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            selectedResult =
                button.dataset.v;

            document
            .querySelectorAll(".choice")
            .forEach(item =>
                item.classList.remove("active")
            );

            button.classList.add("active");
        }
    );
});

$("save").addEventListener(
    "click",
    () => {

        const risk =
            parseFloat($("risk").value);

        const odds =
            parseFloat($("odds").value);

        if (
            !Number.isFinite(risk) ||
            risk <= 0 ||
            risk > 100
        ) {
            alert(
                "Risk yüzdesini kontrol et."
            );
            return;
        }

        if (
            !Number.isFinite(odds) ||
            odds < 1
        ) {
            alert(
                "Geçerli bir oran gir."
            );
            return;
        }

        const startBank =
            currentBank();

        const stake =
            startBank * risk / 100;

        let profitLoss;

        if (
            selectedResult === "FİRE"
        ) {

            profitLoss =
                -stake;

        } else {

            profitLoss =
                stake * (odds - 1);
        }

        const endBank =
            startBank + profitLoss;

        state.entries.push({

            day:
                state.entries.length + 1,

            risk:
                risk,

            odds:
                odds,

            result:
                selectedResult,

            startBank:
                startBank,

            stake:
                stake,

            profitLoss:
                profitLoss,

            end:
                endBank
        });

        saveData();

        $("odds").value = "";

        render();
    }
);

$("reset").addEventListener(
    "click",
    () => {

        const approved =
            confirm(
                "Tüm kasa geçmişi silinsin mi?"
            );

        if (!approved) {
            return;
        }

        state.entries = [];

        saveData();

        render();
    }
);

render();
