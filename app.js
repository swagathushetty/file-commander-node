const fs = require('fs/promises');
const { off } = require('process');

(async ()=>{

    const commandFileHandler = await fs.open("./command.txt","r")


    commandFileHandler.on("change",async ()=>{
          // heavy since it creates a large buffer and we dont ultise it fully
            // const content = await commandFileHandler.read()

            //better memory efficent way
            const size = (await commandFileHandler.stat()).size // get file size
            const buff = Buffer.alloc(size) //create buffer with size of file
            const offset = 0 // The location in the buffer at which to start filling.
            const length = buff.byteLength //how many bytes we want to read
            const position = 0 //The location where to begin reading data from the file

            const content = await commandFileHandler.read(
                buff,
                offset,
                length,
                position
            )
            console.log(content)
    })
    const watcher = fs.watch("./command.txt")

    for await(const event of watcher){

            console.log(event)

        if(event.eventType == "change"){
            commandFileHandler.emit("change")
        }
        
    }
})()