const socket = new WebSocket('wss://pine.candl.pro/ws/testsocket')

socket.onopen = () =>{
    console.log('connected')
}

socket.onmessage = (event) =>{
    console.log(event.data)
}