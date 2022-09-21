const PORT = 12000
const HOST = '180.66.148.171'

const dgram = require('dgram')

const server = dgram.createSocket('udp4')

const clients = []

server.on('listening', () => {
    const address = server.address()
    console.log(`UDP Server listening on ${address.address}:${address.port}`)
})

server.on('message', (message, remote) => {
    console.log(`${remote.address}:${remote.port} - ${message}`)

    let reply = JSON.stringify(clients)
    server.send(reply, 0, reply.length, remote.port, remote.address, (err, bytes) => {
        const address = server.address()
    
        if(err) throw err
        console.log(`UDP ${address.address}:${address.port} -> ${remote.address}:${remote.port}`)
        clients.push([remote.address, remote.port])
        console.log(clients)
    })
})

server.bind(PORT, HOST)