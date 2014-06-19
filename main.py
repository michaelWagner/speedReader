#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import cgi
import webapp2

class MainPage(webapp2.RequestHandler):
    def get(self):
        INDEX_HTML = open('speedReader.html').read()
        self.response.out.write(INDEX_HTML)

# class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
#   def post(self):
#     upload_files = self.get_uploads('file')  # 'file' is file upload field in the form
#     blob_info = upload_files[0]
#     self.redirect('/serve/%s' % blob_info.key())

# class ServeHandler(blobstore_handlers.BlobstoreDownloadHandler):
#   def get(self, resource):
#     resource = str(urllib.unquote(resource))
#     blob_info = blobstore.BlobInfo.get(resource)
#     self.send_blob(blob_info)

def extract_docx_text(infil, outfil):

    # Extract the text from the DOCX file object infile and write it to
    # the text file object outfil.

    paragraphs = getdocumenttext(infil)

    # For Unicode handling.
    new_paragraphs = []
    for paragraph in paragraphs:
        new_paragraphs.append(paragraph.encode("utf-8"))

    outfil.write('\n'.join(new_paragraphs))

def convertFileToText(uploaded_file):

    # if len(sys.argv) != 3:
    #     print usage()
    #     sys.exit(1)

    try:
        infil = opendocx(uploaded_file)
        print infil
        outfil = open('newTextFile.txt', 'w')
        print outfil
    except Exception, e:
        print "Exception: " + repr(e) + "\n"
        sys.exit(1)

    extract_docx_text(infil, outfil)
    print '<div id="hiddenDiv" value=outfil style="display:block"></div>'

app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/', convertFileToText)
], debug=True)
