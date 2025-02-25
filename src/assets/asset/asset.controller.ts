import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@src/auth/auth.guard';
import { AppError } from '@src/utils/app.erro';
import { AssetsDTO } from './asset.Dto';
import { AssetRepository } from './asset.repository';

@ApiTags('Assets')
@Controller('assets')
@UseGuards(AuthGuard)
export class AssetController {
  constructor(
    private asset: AssetRepository,
  ) { }

  @ApiOperation({ summary: 'Create or update an asset' })
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 201,
    description: 'Asset successfully created or updated.',
    type: AssetsDTO,
  })
  @ApiResponse({
    status: 409,
    description: 'The asset symbol is already registered.',
    example: {
      statusCode: 409,
      message: 'The asset symbol is already registered.',
    },
  })
  @Post()
  async post(@Body() body: AssetsDTO) {
    const { id, name, symbol, image, price } = body;

    const assetSimbol = await this.asset.getAssetsBySymbol(symbol);
    if (assetSimbol && (!id || id !== assetSimbol.id)) {
      throw new AppError('The asset symbol is already registered.', 409);
    }

    if (!id) {
      return await this.asset.create({
        name,
        symbol,
        image,
        price,
      });
    }

    return await this.asset.update(id, {
      name,
      symbol,
      image,
      price
    });
  }

  @ApiOperation({ summary: 'Get asset by symbol' })
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    description: 'Asset found.',
    type: AssetsDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Asset not found for the given symbol.',
    example: {
      statusCode: 400,
      message: 'User not found.',
    },
  })
  @Get(':symbol')
  async getBySymbol(@Param('symbol') symbol: string) {
    const asset = await this.asset.getAssetsBySymbol(symbol);
    if (!asset) {
      throw new AppError('Asset not found.', 404);
    }
    return asset;
  }

  @ApiOperation({ summary: 'Delete asset by ID' })
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    description: 'Asset successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Asset not found.',
    example: {
      statusCode: 404,
      message: 'User not found.',
    },
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const asset = await this.asset.getUniqueById(id);
    if (!asset) {
      throw new AppError('Asset not found.', 404);
    }

    await this.asset.delete(id);

    return true;
  }
}
