package net.ahmed.youshar.friends.mapper;

import net.ahmed.youshar.friends.DTO.requestDTO.SearchRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.SearchResponseDTO;
import net.ahmed.youshar.friends.entity.Search;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SearchMapper {
    Search toEntity(SearchRequestDTO requestDTO);
    SearchResponseDTO toResponseDTO(Search entity);
}
