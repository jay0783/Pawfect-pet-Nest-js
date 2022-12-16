import { Injectable, NotFoundException } from '@nestjs/common';

import { PetRepository } from '@pawfect/db/repositories';
import { makePetInfoResponse, PetInfoResponse } from '@pawfect/models';
import { PetEntity } from '@pawfect/db/entities';

@Injectable()
export class PetService {
  constructor(private readonly petRepository: PetRepository) {}

  async getPetInfoForOrder(petId: string): Promise<PetInfoResponse> {
    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId },
      relations: [
        'medication',
        'veterinarians',
        'vaccinations',
        'dogInfo',
        'catInfo',
        'photo',
      ],
    });
    if (!petEntity) {
      throw new NotFoundException('Pet not found');
    }

    return makePetInfoResponse(petEntity);
  }
}
