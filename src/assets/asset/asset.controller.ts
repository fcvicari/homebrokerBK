import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@src/auth/auth.guard';
import { AppError } from '@src/utils/app.erro';
import { AssetsDTO } from './asset.Dto';
import { AssetRepository } from './asset.repository';

@ApiTags('Assets')
@ApiBearerAuth('jwt')
@Controller('assets')
@UseGuards(AuthGuard)
export class AssetController {
  constructor(
    private asset: AssetRepository,
  ) { }

  @ApiOperation({ summary: 'Create or update an asset' })
  @ApiResponse({
    status: 201,
    description: 'Asset successfully created or updated.',
    schema: {
      example: {
        id: "cuid-asset-123",
        name: "Bitcoin",
        symbol: "BTC",
        image: "https://example.com/asset-image.png",
        price: 50000,
        createdAt: "2025-03-03T22:08:36.915Z",
        updatedAt: "2025-03-03T22:08:36.915Z"
      },
    },
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
    const { name, symbol, image, price } = body;

    const asset = await this.asset.getAssetsBySymbol(symbol);

    if (!asset) {
      return await this.asset.create({
        name,
        symbol,
        image,
        price,
      });
    }

    return await this.asset.update(asset.id, {
      name,
      symbol,
      image,
      price
    });
  }


  @ApiOperation({ summary: 'Get all asset' })
  @ApiResponse({
    status: 200,
    description: 'Asset found.',
    schema: {
      example: [{
        id: "cuid-asset-123",
        name: "Bitcoin",
        symbol: "BTC",
        image: "https://example.com/asset-image.png",
        price: 50000,
        createdAt: "2025-03-03T22:08:36.915Z",
        updatedAt: "2025-03-03T22:08:36.915Z"
      }],
    },
  })
  @Get()
  async getAll() {
    return await this.asset.getAllAssets();
  }

  @ApiOperation({ summary: 'Get asset by symbol' })
  @ApiResponse({
    status: 200,
    description: 'Asset found.',
    schema: {
      example: {
        id: "cuid-asset-123",
        name: "Bitcoin",
        symbol: "BTC",
        image: "https://example.com/asset-image.png",
        price: 50000,
        createdAt: "2025-03-03T22:08:36.915Z",
        updatedAt: "2025-03-03T22:08:36.915Z"
      },
    },
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
  @ApiResponse({
    status: 200,
    description: 'Asset successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'This asset is linked to a wallet or an order and cannot be deleted.',
    example: {
      statusCode: 400,
      message: 'This asset is linked to a wallet or an order and cannot be deleted.',
    },
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

    if (asset.Order?.length || asset.WalletAsset?.length) {
      throw new AppError('This asset is linked to a wallet or an order and cannot be deleted.', 400);
    }

    await this.asset.delete(id);

    return true;
  }
}
