const start = "«"
const end = "»"

var dict = {}

function parse() {
    let text = document.getElementById("to_parse").value.replaceAll("\t", " ")
    let date = document.getElementById("date").value
    let values = text.split(start)
    let arr = []
    for (let i = 1; i < values.length; i++) {
        let c = values[i];
        let film = c.split(end)[0].replaceAll("-\n", '').replaceAll('\n', ' ').toUpperCase()
        let tmp = c.split(end)[1]
        if (/^[\s\n-.]*\(/.test(tmp)) {
            tmp = tmp.replace(/^[\s\n-.]*/, "")
            film += " (" + tmp.substring(0, tmp.search(/\)/) + 1)
            tmp = tmp.replace(/^[\s\w\d\nа-яА-Я-]*\)/, "")
        }
        let cinemas = tmp.split(/[.,]/)
        cinemas = cinemas.map((element) => massreplaceAll(element
            .replaceAll("-\n", '')
            .replace(/^ /, '')
            .replace(/ $/)
            .replaceAll('\n', ' '), "\n-."));
        cinemas = cinemas.filter(e => !/^\s*$/.test(e))
        arr.push({ "film": film, "cinemas": cinemas })
    }

    let cinemasPrev = []
    var d = {}
    for (let i = arr.length - 1; i >= 0; i--) {
        let f = arr[i]
        if (f.cinemas.length == 0) {
            f.cinemas = [...cinemasPrev]
        }
        cinemasPrev = [...f.cinemas]
        d[f.film] = {}
        for (const c of f.cinemas) {
            d[f.film][c] = 0
        }
    }
    dict[date] = d
    console.log(dict)
}

function parseTest() {
    var text = document.getElementById("to_parse_test").value
    var values = text.split(start)
    for (let i = 1; i < values.length; i++) {
        var c = values[i];
        var film = c.split(end)[0].replaceAll("-\n", '').replaceAll('\n', ' ').toUpperCase()
        var cinemas = c.split(end)[1].split(",")
        cinemas = cinemas.map((element) => massreplaceAll(element
            .replaceAll("-\n", '')
            .replaceAll('\n', ' '), "\n- ."));
        console.log(film)
        console.log(cinemas)
    }
}

function massreplaceAll(s, replaced) {
    let res = s
    for (const c of replaced) {
        res = res.replaceAll(c, '')
    }
    return res
}

document.getElementById("bu").onclick = () => {
    parse()
}

// document.getElementById("bu_test").onclick = () => {
//     parseTest()
// }

document.getElementById("export").onclick = () => {
    console.log(dict)
    document.getElementById("exp").innerText = JSON.stringify(dict)
}

document.getElementById("import_button").onclick = () => {
    let imported = document.getElementById("import").value
    console.log("PREV DICT")
    console.log(JSON.stringify(dict))
    dict = JSON.parse(imported)
}

document.getElementById("to_csv").onclick = () => {
    let dct = JSON.parse(JSON.stringify(dict))
    let days = Object.keys(dct).sort()
    console.log(days)
    for (let d = 0; d < days.length; d++) {
        let dayFilms = Object.keys(dct[days[d]])
        let day = days[d]
        for (const film of dayFilms) {
            let cinemas = Object.keys(dct[day][film])
            for (const cinema of cinemas) {
                let dNext = d + 1
                while (dNext < days.length &&
                    dct[days[dNext]][film] != null &&
                    dct[days[dNext]][film][cinema] != null) {
                    delete dct[days[dNext]][film][cinema]
                    dNext++
                }
                dct[day][film][cinema] = dNext - d
            }
        }
    }
    console.log(dct)
    exportToCsv(dct)
    
}

function exportToCsv(dct) {
    let res = ""
    let dates = Object.keys(dct).sort()
    for(const day of dates) {
        let films = Object.keys(dct[day])
        for(const film of films) {
            let cinemas = Object.keys(dct[day][film])
            for(const cinema of cinemas) {
                res += `${cinema}\t${day}\t${dct[day][film][cinema]}\t${film}\n`
            }
            res += "\n"
        }
        res += "\n"
    }
    console.log(res)
    document.getElementById("exp").innerText = res
}
