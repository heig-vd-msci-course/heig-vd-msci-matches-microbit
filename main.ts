// Jeu des allumettes en 2D sur micro:bit
// - Les 25 LEDs sont 25 allumettes (allumée = encore en jeu)
// - Choix de la forme : A = forme suivante, B = valider
// - Placement : A = monter/descendre, B = gauche/droite (rebond sur les bords)
// - A+B = retirer les allumettes sous la forme
// - La joueuse qui retire la dernière allumette perd

// États du jeu
const CHOOSE = 0
const PLACE = 1
const END = 2

// Formes possibles : carrés de côté 1, 3 et 4 (1, 9 ou 16 allumettes)
let sizes = [1, 3, 4]

let board: boolean[] = []
let player = 1
let state = CHOOSE
let choice = 0
let x = 0
let y = 0
let dx = 1
let dy = 1
let blink = false
let busy = false

function isLit(px: number, py: number): boolean {
    return board[py * 5 + px]
}

// Vrai si toutes les LEDs sous la forme sont allumées
function fits(size: number, px: number, py: number): boolean {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!isLit(px + i, py + j)) {
                return false
            }
        }
    }
    return true
}

// Vrai si la forme peut être posée quelque part sur le plateau
function canPlace(size: number): boolean {
    for (let px = 0; px <= 5 - size; px++) {
        for (let py = 0; py <= 5 - size; py++) {
            if (fits(size, px, py)) {
                return true
            }
        }
    }
    return false
}

function remaining(): number {
    let count = 0
    for (let i = 0; i < 25; i++) {
        if (board[i]) {
            count++
        }
    }
    return count
}

function newGame() {
    board = []
    for (let i = 0; i < 25; i++) {
        board.push(true)
    }
    player = 1
    startTurn()
}

function startTurn() {
    busy = true
    basic.clearScreen()
    basic.showNumber(player)
    basic.pause(500)
    state = CHOOSE
    choice = 0 // le 1x1 est toujours possible tant qu'il reste une allumette
    busy = false
}

function endGame() {
    busy = true
    state = END
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
    let winner = 3 - player
    basic.showString("J" + winner + " GAGNE")
    basic.showNumber(winner)
    busy = false
}

input.onButtonPressed(Button.A, function () {
    if (busy) {
        return
    }
    if (state == CHOOSE) {
        // Forme suivante, en sautant celles qui ne rentrent nulle part
        choice = (choice + 1) % sizes.length
        while (!canPlace(sizes[choice])) {
            choice = (choice + 1) % sizes.length
        }
    } else if (state == PLACE) {
        // Monter / descendre avec rebond
        y += dy
        if (y <= 0 || y >= 5 - sizes[choice]) {
            dy = -dy
        }
    }
})

input.onButtonPressed(Button.B, function () {
    if (busy) {
        return
    }
    if (state == CHOOSE) {
        // Valider la forme et commencer le placement en haut à gauche
        state = PLACE
        x = 0
        y = 0
        dx = 1
        dy = 1
    } else if (state == PLACE) {
        // Gauche / droite avec rebond
        x += dx
        if (x <= 0 || x >= 5 - sizes[choice]) {
            dx = -dx
        }
    }
})

input.onButtonPressed(Button.AB, function () {
    if (busy) {
        return
    }
    if (state == PLACE) {
        let size = sizes[choice]
        if (fits(size, x, y)) {
            // Retirer les allumettes sous la forme
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    board[(y + j) * 5 + x + i] = false
                }
            }
            if (remaining() == 0) {
                endGame() // la joueuse actuelle a pris la dernière : elle perd
            } else {
                player = 3 - player
                startTurn()
            }
        } else {
            // Placement interdit : une LED sous la forme est déjà éteinte
            busy = true
            basic.showIcon(IconNames.No)
            basic.pause(500)
            busy = false
        }
    } else if (state == END) {
        newGame()
    }
})

// Affichage, rafraîchi en continu
basic.forever(function () {
    if (!busy) {
        blink = !blink
        let size = sizes[choice]
        if (state == CHOOSE) {
            // Aperçu de la forme, centrée
            let offset = Math.floor((5 - size) / 2)
            basic.clearScreen()
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    led.plot(offset + i, offset + j)
                }
            }
        } else if (state == PLACE) {
            // Plateau + forme qui clignote par-dessus
            for (let px = 0; px < 5; px++) {
                for (let py = 0; py < 5; py++) {
                    let inShape = px >= x && px < x + size && py >= y && py < y + size
                    if (inShape ? blink : isLit(px, py)) {
                        led.plot(px, py)
                    } else {
                        led.unplot(px, py)
                    }
                }
            }
        }
    }
    basic.pause(250)
})

newGame()
