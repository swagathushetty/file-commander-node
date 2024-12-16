const fs = require('fs/promises');

(async ()=>{
    const createFile = async(filePath) =>{
        try {
            const existingFileHandle = await fs.open(filePath,"r")
            existingFileHandle.close()
            return console.log(`the file ${filePath} already exists`)
        } catch (error) {
          const newFileHandle = await fs.open(filePath,"w")
          console.log('a New file was sucessfilly created')
          newFileHandle.close()
        }
       
       
    }

    const CREATE_FILE = "create a file"
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

            const command = buff.toString("utf-8")

            //create a file <path>
            if(command.includes(CREATE_FILE)){
                const filePath = command.substring(CREATE_FILE.length + 1)
                createFile(filePath)
            }
    })



    const watcher = fs.watch("./command.txt")

    for await(const event of watcher){

            console.log(event)

        if(event.eventType == "change"){
            commandFileHandler.emit("change")
        }
        
    }
})()