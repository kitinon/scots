import { bootStrap, Controller, Get, Res} from "./core"

@Controller('/')
class MyController {
  @Get()
  hello(@Res() res) {
    res.send('Hello, world!')
  }
}

@Controller('/cat')
class CatController {
  genus: string = 'felis'
  @Get()
  hello(@Res() res) {
    res.send(`Meow (${this.genus})`)
  }
}

bootStrap([
  MyController,
  CatController
])
.listen(3000, ()=>console.log('listening on port 3000'))
