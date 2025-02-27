package com.touragency.service;

import com.touragency.model.Package;
import com.touragency.model.PackageType;
import com.touragency.repository.PackageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PackageServiceTest {

    @Mock
    private PackageRepository packageRepository;

    @InjectMocks
    private PackageService packageService;

    private Package testPackage;
    private PackageType testPackageType;

    @BeforeEach
    void setUp() {
        testPackage = new Package();
        testPackage.setId(1L);
        testPackage.setName("Test Package");
        testPackage.setDescription("Test Description");
        testPackage.setCountry("Test Country");

        testPackageType = new PackageType();
        testPackageType.setName("Standard");
        testPackageType.setPrice(1000.0);
        testPackageType.setTourPackage(testPackage);
        
        testPackage.setPackageTypes(Arrays.asList(testPackageType));
    }

    @Test
    void getAllPackages_ShouldReturnListOfPackages() {
        // Arrange
        when(packageRepository.findAll()).thenReturn(Arrays.asList(testPackage));

        // Act
        List<Package> result = packageService.getAllPackages();

        // Assert
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Package");
        verify(packageRepository, times(1)).findAll();
    }

    @Test
    void getPackageById_WhenPackageExists_ShouldReturnPackage() {
        // Arrange
        when(packageRepository.findById(1L)).thenReturn(Optional.of(testPackage));

        // Act
        Optional<Package> result = packageService.getPackageById(1L);

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Test Package");
        verify(packageRepository, times(1)).findById(1L);
    }

    @Test
    void getPackageById_WhenPackageDoesNotExist_ShouldReturnEmpty() {
        // Arrange
        when(packageRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Optional<Package> result = packageService.getPackageById(1L);

        // Assert
        assertThat(result).isEmpty();
        verify(packageRepository, times(1)).findById(1L);
    }

    @Test
    void createPackage_ShouldReturnCreatedPackage() {
        // Arrange
        when(packageRepository.save(any(Package.class))).thenReturn(testPackage);

        // Act
        Package result = packageService.createPackage(testPackage);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Package");
        verify(packageRepository, times(1)).save(any(Package.class));
    }

    @Test
    void updatePackage_WhenPackageExists_ShouldReturnUpdatedPackage() {
        // Arrange
        when(packageRepository.findById(1L)).thenReturn(Optional.of(testPackage));
        when(packageRepository.save(any(Package.class))).thenReturn(testPackage);

        Package updatedPackage = new Package();
        updatedPackage.setName("Updated Package");

        // Act
        Optional<Package> result = packageService.updatePackage(1L, updatedPackage);

        // Assert
        assertThat(result).isPresent();
        verify(packageRepository, times(1)).findById(1L);
        verify(packageRepository, times(1)).save(any(Package.class));
    }

    @Test
    void updatePackage_WhenPackageDoesNotExist_ShouldReturnEmpty() {
        // Arrange
        when(packageRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Optional<Package> result = packageService.updatePackage(1L, testPackage);

        // Assert
        assertThat(result).isEmpty();
        verify(packageRepository, times(1)).findById(1L);
        verify(packageRepository, never()).save(any(Package.class));
    }

    @Test
    void deletePackage_WhenPackageExists_ShouldReturnTrue() {
        // Arrange
        when(packageRepository.existsById(1L)).thenReturn(true);
        doNothing().when(packageRepository).deleteById(1L);

        // Act
        boolean result = packageService.deletePackage(1L);

        // Assert
        assertThat(result).isTrue();
        verify(packageRepository, times(1)).existsById(1L);
        verify(packageRepository, times(1)).deleteById(1L);
    }

    @Test
    void deletePackage_WhenPackageDoesNotExist_ShouldReturnFalse() {
        // Arrange
        when(packageRepository.existsById(1L)).thenReturn(false);

        // Act
        boolean result = packageService.deletePackage(1L);

        // Assert
        assertThat(result).isFalse();
        verify(packageRepository, times(1)).existsById(1L);
        verify(packageRepository, never()).deleteById(any());
    }
}
