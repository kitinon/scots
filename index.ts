import { bootStrap, Controller, Get, Res} from "./core"

@Controller()
class MyController {
  @Get()
  getHello(@Res() res: any) {
    res.send('Hello, world!')
  }
}

bootStrap(MyController)
.listen(3000, ()=>console.log('listening on port 3000'))
