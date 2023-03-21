import { Controller, Get, Param, Res } from '@nestjs/common';
import { SearchService } from './search.service';
import { Response } from 'express';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':query')
  async findOne(@Res() response: Response, @Param('query') query: string = '') {
    if (query.length === 0) {
      return response
        .status(400)
        .send({ message: 'La búsqueda no puede estar vacía' });
    }
    return response.status(200).send(await this.searchService.findAll(query));
  }
}
