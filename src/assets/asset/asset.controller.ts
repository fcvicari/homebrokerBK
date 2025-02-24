import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/auth/auth.guard';
import { AppError } from '@src/utils/app.erro';
import { AssetsDTO } from './asset.Dto';
import { AssetRepository } from './asset.repository';

@Controller('assets')
@UseGuards(AuthGuard)
export class AssetController {
  constructor(
    private asset: AssetRepository,
  ) { }

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

  @Get(':symbol')
  async getBySymbol(@Param('symbol') symbol: string) {
    return this.asset.getAssetsBySymbol(symbol);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const asset = await this.asset.getUniqueById(id);
    if (!asset) {
      throw new AppError('Asset not found.', 400);
    }

    await this.asset.delete(id);

    return true;
  }
}
