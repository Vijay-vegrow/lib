require 'csv'

namespace :books do
  desc "Import first 100 books from CSV"
  task import: :environment do
    file_path = Rails.root.join('books_utf8.csv')
    puts "Importing books from #{file_path}..."

    count = 0
    max = 100

    CSV.foreach(file_path, headers: true, col_sep: ';', encoding: 'bom|utf-8:utf-8') do |row|
      break if count >= max

      begin
        Book.create!(
          title: row['Book-Title'],
          author: row['Book-Author'],
          publication_year: row['Year-Of-Publication'],
          publisher: row['Publisher'],
          image_url: row['Image-URL-L'],
          available: true
        )
        count += 1
      rescue => e
        puts "Skipping row due to error: #{e.message}"
      end
    end

    puts "Import complete — #{count} books imported."
  end
end
