import { Cat } from './../cats.schema';
import { JwtAuthGuard } from './../../auth/jwt/jwt.guard';
import { LoginRequestDto } from './../../auth/dto/login.requestdto';
import { AuthService } from './../../auth/auth.service';
import { CatsService } from '../services/cats.service';
import { HttpExceptionFilter } from '../../common/exceptions/http-exception.filter';
import {
  Controller,
  Get,
  Post,
  UseFilters,
  Body,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { SuccessInterceptor } from '../../common/interceptors/success.intercept';
import { CatRequestDto } from '../dto/cats.requestdto';
import { ReadOnlyCatDto } from '../dto/cats.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter) // 컨트롤러 범위
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '모든 고양이 가져오기' })
  @Get('all')
  getAllCats() {
    return this.catsService.getAllCat();
  }

  @ApiOperation({ summary: '현재 고양이 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentCat(@CurrentUser() cat) {
    return cat.readOnlyData;
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut() {
    return 'logout';
  }

  @ApiOperation({ summary: '고양이 이미지 업로드' })
  @UseInterceptors(FileInterceptor('image', multerOptions('cats')))
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  uploadCatImg(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() cat: Cat,
  ) {
    return this.catsService.uploadImg(cat, file);
  }
}
