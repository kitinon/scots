import { bootStrap, Controller, Get, Res} from "./core"

@Controller('/')
class MyController {
  @Get()
  getHello(@Res() res) {
    res.send('Hello, world!')
  }
}

@Controller('/cat')
class CatController {
  @Get()
  getHello(@Res() res) {
    res.send('Meow')
  }
}

bootStrap([
  MyController,
  CatController
])
.listen(3000, ()=>console.log('listening on port 3000'))
