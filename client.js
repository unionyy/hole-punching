const PORT = 12000
const HOST = '180.66.148.171'

const dgram = require('dgram')
const readline = require("readline")

const client = dgram.createSocket('udp4')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let clients = []

rl.on('line', (line) => {
    if(line === 'register') {
        let message = 'register'
        client.send(message, 0, message.length, PORT, HOST, (err, bytes) => {
            const address = client.address()

            if(err) throw err
            console.log(`UDP ${address.address}:${address.port} -> ${HOST}:${PORT}`)
        })
    }
    else if(line.slice(0, 7) === 'connect') {
        let otherIndex = Number(line[8])
        let other = clients[otherIndex]
        let otherAddress = other[0]
        let otherPort = other[1]
        let count = 1
        setInterval(() => {
            let msg = "msg No." + count
            count++
            client.send(msg, 0, msg.length, otherPort, otherAddress, (err, bytes) => {
                const address = client.address()
    
                if(err) throw err
                console.log(`UDP ${address.address}:${address.port} -> ${otherAddress}:${otherPort}`)
            })
        }, 3000)
    }
})

client.on('listening', () => {
    const address = client.address()
    console.log(`UDP Server listening on ${address.address}:${address.port}`)
})

client.on('message', (message, remote) => {
    console.log(`${remote.address}:${remote.port} - ${message}`)

    if(remote.port === PORT && remote.address === HOST) {
        clients = JSON.parse(message)
    }
})