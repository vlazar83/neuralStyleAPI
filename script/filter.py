#Import required image modules
from PIL import Image, ImageFilter
import sys
import os

#Import all the enhancement filter from pillow
from PIL.ImageFilter import (
   BLUR, CONTOUR, DETAIL, EDGE_ENHANCE, EDGE_ENHANCE_MORE,
   EMBOSS, FIND_EDGES, SMOOTH, SMOOTH_MORE, SHARPEN
)
#Create image object
img = Image.open('./public/images/'+ sys.argv[1])
imgFileNameWithoutExt = os.path.splitext('./public/images/'+ sys.argv[1])[0]

#Applying the blur filter
img1 = img.filter(CONTOUR)
img1.save(imgFileNameWithoutExt + '_output.png')
img1.show()