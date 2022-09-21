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
	// register 명령어를 통해 서버로 패킷을 보낸다. (클라이언트들의 public IP와 포트 번호 정보를 요청한다)
    if(line === 'register') {
        let message = 'register'
        client.send(message, 0, message.length, PORT, HOST, (err, bytes) => {
            const address = client.address()

            if(err) throw err
            console.log(`UDP ${address.address}:${address.port} -> ${HOST}:${PORT}`)
        })
    }

	// connect 명령어를 통해 원하는 클라이언트와 통신한다.
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

// 서버로부터 클라이언트들의 public IP 와 포트 번호 정보를 받으면 저장한다.
client.on('message', (message, remote) => {
    console.log(`${remote.address}:${remote.port} - ${message}`)

    if(remote.port === PORT && remote.address === HOST) {
        clients = JSON.parse(message)
    }
})