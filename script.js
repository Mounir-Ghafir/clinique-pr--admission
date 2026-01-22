const form = document.getElementById("demande-form")
const nom = document.getElementById("nom")
const prenom = document.getElementById("prenom")
const telephone = document.getElementById("telephone")
const email = document.getElementById("email")
const motif = document.getElementById("motif")
const date = document.getElementById("date")
const table = document.getElementById("corps-tableau")
const previousBtn = document.getElementById("btn-precedent")
const nextBtn = document.getElementById("btn-suivant")
const pageElement = document.getElementById("page-actuelle")
const pagesElement = document.getElementById("pages-totales")
const message = document.getElementById("message-section")
const counter = document.getElementById("compteur-demandes")

let page = 1
let pages
let begin = 0
let end = 5
let steps = 5
let demandes = JSON.parse(localStorage.getItem("demandes")) || []
let length = demandes.length


form.addEventListener("submit", function(event) {
    event.preventDefault()
    checkForm()
})

nextBtn.addEventListener("click", next)

previousBtn.addEventListener("click", previous)

function next() {
    page++
    begin += steps
    end += steps
    loadPage()
}

function previous() {
    page--
    begin -= steps
    end -= steps
    loadPage()
}

function createId() {
    let id = crypto.randomUUID()
    return id
}

function addDemande() {
    let demande = {
        nom: nom.value,
        prenom: prenom.value,
        telephone: telephone.value,
        email: email.value,
        motif: motif.value,
        date: date.value,
        id: createId(),
    }
    demandes.push(demande)
    localStorage.setItem("demandes", JSON.stringify(demandes))
    length++
    loadPage()
    form.reset()
}

function showDemandes(demande) {

    if(demande === undefined) {
        return
    }

    demandesLength()

    const tr = document.createElement("tr")
    tr.innerHTML += `
    <td>${demande.nom}</td>
    <td>${demande.prenom}</td>
    <td>${demande.telephone}</td>
    <td>${demande.email}</td>
    <td>${demande.motif}</td>
    <td>${demande.date}</td>
    <td><button class="del-btn">supprimer</button></td>
    `
    const delBtn = tr.querySelector(".del-btn")
    delBtn.addEventListener("click",() => deleteDemande(demande.id))

    table.appendChild(tr)

    pages = Math.ceil(demandes.length / steps)

    pageElement.textContent = page
    pagesElement.textContent = pages

    if(demandes.length > steps) {
        nextBtn.disabled = false
    }

    if(pages === page) {
        nextBtn.disabled = true
    }

    if(page > 1) {
        previousBtn.disabled = false
    }

    if(page === 1) {
        previousBtn.disabled = true
    }
}

function loadPage() {
    table.innerHTML = ''
    for(let i = begin ; i < end ; i++) {
        showDemandes(demandes[i])
    }
}

function deleteDemande(id) {
    let index = demandes.findIndex(demande => demande.id === id)
    demandes.splice(index,1)
    length--
    localStorage.setItem("demandes", JSON.stringify(demandes))
    if (Math.ceil(demandes.length / steps) < pages) {
        previous()
    } else {
        loadPage()
    }
    
}

function checkForm() {
    message.innerHTML = ""
    if(!nom.value.trim() || !prenom.value.trim() || !motif.value.trim() || !date.value) {
        let p = document.createElement("p")
        p.id = "fail"
        p.textContent = "Veuillez compléter les champs obligatoires"
        message.appendChild(p)
    }else {
        let p = document.createElement("p")
        p.id = "success"
        p.textContent = "Demande ajoutée"
        message.appendChild(p)
        addDemande()
    }
    message.style.display = "block"
    setTimeout(() => {
        message.style.display = "none"
    },1500)
}

function demandesLength() {
    counter.innerHTML = `${length} demande(s) enregistrée(s)`
}

loadPage()

