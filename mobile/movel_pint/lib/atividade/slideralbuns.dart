import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:movel_pint/backend/api_service.dart';
import 'package:movel_pint/widgets/bottom_navigation_bar.dart';
import 'package:movel_pint/widgets/customAppBar.dart';
class AlbumSliderPage extends StatelessWidget {
  final List<String> albumImages;
  final int contentId;

  AlbumSliderPage({required this.albumImages, required this.contentId});

  final ImagePicker _picker = ImagePicker();
  
  Future<void> _addNewAlbum() async {
    try {
      final List<XFile>? pickedFiles = await _picker.pickMultiImage();
      if (pickedFiles != null && pickedFiles.isNotEmpty) {
        List<Uint8List> files = [];
        for (var file in pickedFiles) {
          Uint8List bytes = await file.readAsBytes();
          files.add(bytes);
        }

        var response = await ApiService.criarFormDataArray(
          'album',
          data: {'conteudo': contentId}, // Dados adicionais
          files: files,
        );

        if (response.statusCode == 200) {
          print('Upload bem-sucedido');
        } else {
          print('Falha no upload: ${response.statusCode}');
        }
      }
    } catch (e) {
      print("Erro ao selecionar imagens: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
  return Scaffold(
    appBar: CustomAppBar(),
    body: SafeArea(
      child: albumImages.isEmpty
          ? Center(child: Text("Este conteúdo ainda não tem imagens"))
          : GridView.builder(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 4.0,
                crossAxisSpacing: 4.0,
                childAspectRatio: 1.0,
              ),
              itemCount: albumImages.length,
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () {
                    _showImageDetail(context, albumImages[index]);
                  },
                  child: Card(
                    clipBehavior: Clip.antiAlias,
                    child: Image.network(
                      albumImages[index],
                      fit: BoxFit.cover,
                    ),
                  ),
                );
              },
            ),
    ),
    floatingActionButton: FloatingActionButton(
      onPressed: _addNewAlbum,
      child: Icon(Icons.add),
    ),
    bottomNavigationBar: CustomBottomNavigationBar(
      selectedIndex: 2,
      onItemTapped: (int index) {
        // Navegação entre páginas
      },
    ),
  );
}


  void _showImageDetail(BuildContext context, String imageUrl) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ImageDetailPage(imageUrl: imageUrl),
      ),
    );
  }
}

class ImageDetailPage extends StatelessWidget {
  final String imageUrl;

  ImageDetailPage({required this.imageUrl});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: GestureDetector(
          onTap: () {
            Navigator.pop(context);
          },
          child: Image.network(
            imageUrl,
            fit: BoxFit.contain,
          ),
        ),
      ),
    );
  }
}
