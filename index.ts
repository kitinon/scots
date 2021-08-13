import { bootStrap, Controller, Get, Res} from "./core"

@Controller('/api')
class MyController {
  @Get()
  getHello(@Res() res: any) {
    res.send('Hello, World!')
  }
}

bootStrap(MyController)
.listen(3000, ()=>console.log('listening on port 3000'))
