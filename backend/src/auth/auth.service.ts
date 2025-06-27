import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    // Buscar usuario por email directamente usando Prisma
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Excluimos la contraseña del objeto usuario que retornamos
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar que el usuario no exista
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está en uso');
    }

    // Hash de la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear el usuario directamente con Prisma
    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        phoneNumber: registerDto.phoneNumber
      }
    });

    // Excluir la contraseña de la respuesta
    const { password: _, ...result } = newUser;

    // Generar token JWT
    const payload = { email: newUser.email, sub: newUser.id };

    return {
      user: result,
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Excluir la contraseña
    const { password: _, ...result } = user;
    return result;
  }
}
