const express = require('express');
const server = express();
const usuarios = require('./src/data/usuarios.json')

server.use(express.json())

server.get('/usuarios', (req, res) => {

    usuarios.forEach(a => {
        Object.defineProperty(a, 'password', {
            enumerable: false
        })
    })

    if (req.url.length > 9) {

        let url = req.url.split('?')
        url.shift()
        url = String(url)

        let verifica = usuarios.map(a => a.id == url)

        if (url == "" || !verifica.includes(true)) {
            return res.status(404).json(`O usuário ${url} não foi encontrado`);
        }

        let value = usuarios.filter(a => a.id == url)

        return res.json(value)

    } else {

        return res.json(usuarios)
    }

})

server.post('/cadastro', (req, res) => {

    let arrCorrectKeys = ["name", "email", "password", "username"]
    let arrKeys = Object.keys(req.body)
    let arr = []

    let novaId = parseInt(usuarios[usuarios.length - 1].id) + 1
    if(usuarios[usuarios.length - 1].inactive == true){
        novaId = parseInt(usuarios[usuarios.length - 2].id) + 1
    }
    if(usuarios[usuarios.length - 1] == undefined){
        novaId = 1
    }
    arrCorrectKeys.forEach(a => {
        if (arrKeys.includes(a)) {
            arr.push(true)
        } else arr.push(false)
    })
    if (arr.includes(false) || arrKeys.length < 4 || arrKeys.length > 4) {
        return res.status(406).json(`Inválido`);

    }

    let arrValues = Object.values(req.body)
    let arr2 = []
    arrValues.forEach(a => {
        if (typeof a != "string") {
            console.log(typeof a)
            arr2.push(false)
        } else arr2.push(true)
    })
    if (arr2.includes(false)) {
        return res.status(406).json(`Deve-se inserir uma string`);

    }
    if (req.body.password.length < 6) {
        return res.status(400).json(`Senha menor que 6 caracteres`);
    }

    let arrUsernames = []
    let arrEmails = []
    usuarios.forEach(a => {
        arrUsernames.push(a.username)
        arrEmails.push(a.email)
    })
    if (arrUsernames.includes(req.body.username) || arrEmails.includes(req.body.email)) {
        return res.status(403).json(`E-mail ou nome de usuário já cadastrados`);
    }

    req.body.id = String(novaId)
    usuarios.push(req.body)


    return res.status(200).json(`Cadastro realizado com sucesso`);

})

server.post('/editar', (req, res) => {
    let url = req.url.split('?')
    url.shift()
    url = String(url)

    let verifica = usuarios.map(a => a.id == url)

    if (req.url.length < 9) {
        return res.status(401).json(`Inválido`);
    }
    if (url == "" || !verifica.includes(true)) {
        return res.status(404).json(`O usuário ${url} não foi encontrado`);
    }

    let arrKeys = Object.keys(req.body)
    let arrValues = Object.values(req.body)

    let arr = []
    arrValues.forEach(a => {
        if (typeof a != "string") {
            console.log(typeof a)
            arr.push(false)
        } else arr.push(true)
    })
    if (arr.includes(false)) {
        return res.status(401).json(`Inválido`);
    }

    let arrCorrectKeys = ["name", "email", "password", "username"]
    for (let i in arrKeys) {
        if (arrCorrectKeys.includes(arrKeys[i])) {
            continue
        } else return res.status(401).json(`Deve-se inserir uma string`);
    }

    if (arrKeys.includes(arrCorrectKeys[2])) {
        if (req.body.password.length < 6) {
            return res.status(400).json(`Senha menor que 6 caracteres`);
        }
    }

    let arrUsernames = []
    let arrEmails = []
    usuarios.forEach(a => {
        arrUsernames.push(a.username)
        arrEmails.push(a.email)
    })
    if (arrKeys.includes(arrCorrectKeys[3]) || arrKeys.includes(arrCorrectKeys[1])) {
        if (arrUsernames.includes(req.body.username) || arrEmails.includes(req.body.email)) {
            return res.status(406).json(`E-mail ou nome de usuário já cadastrados`);
        }
    }

    for (let i in arrKeys) {
        console.log(usuarios[url][arrKeys[i]])
        usuarios[url][arrKeys[i]] = arrValues[i]
    }
    return res.status(200).json(`Cadastro alterado com sucesso`);

})

server.delete('/delete', (req, res) => {
    let url = req.url.split('?')
    url.shift()
    url = String(url)

    let verifica = usuarios.map(a => a.id == url)

    if (req.url.length < 8) {
        return res.status(400).json(`Id inválido`);
    }
    if (url == "" || !verifica.includes(true)) {
        return res.status(404).json(`O usuário ${url} não foi encontrado`);
    }

    usuarios[url].inactive = true
    delete usuarios[url].id

    let keys = ["id", "name", "email", "password", "username", "inactive"]
    keys.forEach(a =>{
        Object.defineProperty(usuarios[url], a, {
            enumerable:false,
            configurable: false,
            writable: false
        })
    })
    
    return res.status(200).json(`Usuário deletado`);
})

server.listen(3000, () => {
    console.log('Servidor funcionando')
})
