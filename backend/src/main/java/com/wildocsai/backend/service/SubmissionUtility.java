package com.wildocsai.backend.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

public class SubmissionUtility
{
    // Helper classes
    public static class PageRange
    {
        private final int startPage;
        private final int endPage;

        public PageRange(int startPage, int endPage)
        {
            this.startPage = startPage;
            this.endPage = endPage;
        }

        public int getStartPage()
        {
            return startPage;
        }

        public int getEndPage()
        {
            return endPage;
        }

        public boolean containsPage(int page)
        {
            return page >= startPage && page <= endPage;
        }
    }

    public static class PDFData
    {
        private final String content;
        private final Map<Integer, Integer> imagesPerPage;
        private final Map<String, PageRange> sectionPages;

        public PDFData(String content, Map<Integer, Integer> imagesPerPage, Map<String, PageRange> sectionPages)
        {
            this.content = content;
            this.imagesPerPage = imagesPerPage;
            this.sectionPages = sectionPages;
        }

        public String getContent()
        {
            return content;
        }

        public Map<Integer, Integer> getImagesPerPage()
        {
            return imagesPerPage;
        }

        public Map<String, PageRange> getSectionPages()
        {
            return sectionPages;
        }
    }

    // 1. Validate file format
    public static void validateFileFormat(MultipartFile file)
    {
        String name = file.getOriginalFilename();
        String type = file.getContentType();

        if(name == null || !name.endsWith(".pdf"))
        {
            throw new IllegalArgumentException("Invalid file format. Only PDF files are supported.");
        }

        if (type == null || !type.equals("application/pdf")) 
        {
            throw new IllegalArgumentException("Invalid file format. Only PDF files are supported.");
        }
    }

    public static String getFileExtension(String fileName)
    {
        if(fileName == null || !fileName.contains("."))
        {
            return "";
        }

        return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    }

    // 2. Extract content and images from PDF
    public static PDFData extractPDFData(MultipartFile file) throws IOException
    {
        try(PDDocument document = Loader.loadPDF(file.getBytes()))
        {
            StringBuilder fullText = new StringBuilder();
            Map<Integer, Integer> imagesPerPage = new HashMap<>();
            Map<String, PageRange> sectionPages = new HashMap<>();
            
            PDFTextStripper stripper = new PDFTextStripper();
            int totalPages = document.getNumberOfPages();
            
            // Tracking variables for section detection
            String currentModule = null;
            String currentTransaction = null;
            String currentTransactionKey = null;
            Integer sectionStartPage = null;
            boolean inDetailedDesign = false;
            
            Pattern modulePattern = Pattern.compile("module\\s+(\\d+)\\s*[:\\-]?\\s*(.+)", Pattern.CASE_INSENSITIVE);
            Pattern transactionPattern = Pattern.compile("(\\d+\\.\\d+)\\s+(.+)", Pattern.CASE_INSENSITIVE);
            
            // Process each page
            for(int pageNum = 1; pageNum <= totalPages; pageNum++)
            {
                // Extract text from current page
                stripper.setStartPage(pageNum);
                stripper.setEndPage(pageNum);
                String pageText = stripper.getText(document);
                fullText.append(pageText);
                
                // Count images on this page
                PDPage page = document.getPage(pageNum - 1); // 0-indexed
                int imageCount = countImagesOnPage(page);
                if(imageCount > 0)
                {
                    imagesPerPage.put(pageNum, imageCount);
                    System.out.println("Page " + pageNum + ": Found " + imageCount + " image(s)");
                }
                
                // Detect sections on this page
                String lowerPageText = pageText.toLowerCase();
                String[] lines = pageText.split("\\n");
                
                for(String line : lines)
                {
                    String lowerLine = line.trim().toLowerCase();
                    
                    // Check if we're starting a new module or transaction header
                    boolean isNewTransactionHeader = modulePattern.matcher(line).find() ||
                                                      transactionPattern.matcher(line).find();
                    
                    // Save previous transaction if starting a new one
                    if(currentTransactionKey != null && sectionStartPage != null && isNewTransactionHeader)
                    {
                        sectionPages.put(currentTransactionKey, new PageRange(sectionStartPage, pageNum - 1));
                        System.out.println("Saved transaction: " + currentTransactionKey + " (Pages " + sectionStartPage + "-" + (pageNum - 1) + ")");
                        currentTransactionKey = null;
                        sectionStartPage = null;
                    }
                    
                    // Detect Architectural Design section
                    if(lowerLine.contains("architectural design") && !lowerLine.contains("detailed design"))
                    {
                        if(currentTransactionKey != null && sectionStartPage != null)
                        {
                            sectionPages.put(currentTransactionKey, new PageRange(sectionStartPage, pageNum - 1));
                            System.out.println("Saved transaction: " + currentTransactionKey + " (Pages " + sectionStartPage + "-" + (pageNum - 1) + ")");
                        }
                        currentTransactionKey = "ArchitecturalDesign";
                        sectionStartPage = pageNum;
                        System.out.println("Started section: ArchitecturalDesign at page " + pageNum);
                        currentModule = null;
                        currentTransaction = null;
                    }
                    // Detect Detailed Design section start
                    else if(lowerLine.contains("detailed design"))
                    {
                        if(currentTransactionKey != null && sectionStartPage != null)
                        {
                            sectionPages.put(currentTransactionKey, new PageRange(sectionStartPage, pageNum - 1));
                            System.out.println("Saved transaction: " + currentTransactionKey + " (Pages " + sectionStartPage + "-" + (pageNum - 1) + ")");
                        }
                        System.out.println("Detected Detailed Design section at page " + pageNum + " - Now tracking modules/transactions");
                        inDetailedDesign = true;
                        currentTransactionKey = null;
                        sectionStartPage = null;
                        currentModule = null;
                        currentTransaction = null;
                    }
                    // Detect Module (only when in detailed design section)
                    else if(inDetailedDesign)
                    {
                        Matcher moduleMatcher = modulePattern.matcher(line);
                        Matcher transactionMatcher = transactionPattern.matcher(line);
                        
                        if(moduleMatcher.find())
                        {
                            if(currentTransactionKey != null && sectionStartPage != null)
                            {
                                sectionPages.put(currentTransactionKey, new PageRange(sectionStartPage, pageNum - 1));
                                System.out.println("Saved transaction: " + currentTransactionKey + " (Pages " + sectionStartPage + "-" + (pageNum - 1) + ")");
                            }
                            String moduleNumber = moduleMatcher.group(1);
                            currentModule = "Module_" + moduleNumber;
                            System.out.println("Detected Module " + moduleNumber + " at page " + pageNum);
                            currentTransaction = null;
                            currentTransactionKey = null;
                            sectionStartPage = null;
                        }
                        // Detect Transaction
                        else if(transactionMatcher.find() && currentModule != null)
                        {
                            if(currentTransactionKey != null && sectionStartPage != null)
                            {
                                sectionPages.put(currentTransactionKey, new PageRange(sectionStartPage, pageNum - 1));
                                System.out.println("Saved transaction: " + currentTransactionKey + " (Pages " + sectionStartPage + "-" + (pageNum - 1) + ")");
                            }
                            String transactionNumber = transactionMatcher.group(1);
                            currentTransaction = currentModule + "_Transaction_" + transactionNumber;
                            currentTransactionKey = currentTransaction;
                            sectionStartPage = pageNum;
                            System.out.println("Started transaction: " + currentTransaction + " at page " + pageNum);
                        }
                    }
                }
            }
            
            // Save the last transaction if any
            if(currentTransactionKey != null && sectionStartPage != null)
            {
                sectionPages.put(currentTransactionKey, new PageRange(sectionStartPage, totalPages));
                System.out.println("Saved transaction: " + currentTransactionKey + " (Pages " + sectionStartPage + "-" + totalPages + ")");
            }
            
            // Summary of all detected sections
            System.out.println("\n=== Summary: Detected " + sectionPages.size() + " sections ===");
            for(Map.Entry<String, PageRange> entry : sectionPages.entrySet())
            {
                PageRange range = entry.getValue();
                int imageCount = countImagesInRange(imagesPerPage, range);
                System.out.println(entry.getKey() + ": Pages " + range.getStartPage() + "-" + range.getEndPage() + " (" + imageCount + " images)");
            }
            System.out.println("==========================================\n");
            
            return new PDFData(fullText.toString(), imagesPerPage, sectionPages);
        }
    }
    
    private static int countImagesOnPage(PDPage page) throws IOException
    {
        int imageCount = 0;
        PDResources resources = page.getResources();
        
        if(resources != null)
        {
            for(COSName name : resources.getXObjectNames())
            {
                if(resources.isImageXObject(name))
                {
                    imageCount++;
                }
            }
        }
        
        return imageCount;
    }

    // 3. Clean content
    public static String cleanContent(String content)
    {
        if(content == null || content.isEmpty())
        {
            return "";
        }

        String cleaned = content;

        // Remove content from "Signature" up to (but not including) "Preface"
        cleaned = cleaned.replaceAll("(?s)Signature.*?(?=Preface)", "");

        // Remove the entire Table of Contents section (from "Table of Contents" to the next numbered section)
        cleaned = cleaned.replaceAll("(?s)Table of Contents.*?(?=\\n\\s*Software Design Descriptions)", "");

        // Remove recurring multi-line headers (Software Design Descriptions + project name + version + date)
        cleaned = cleaned.replaceAll
        (
            "(?m)^Software Design Descriptions\\s*\\n\\s*\\S+.*\\s*\\n\\s*Document Version:.*\\s*\\n\\s*Published Date:.*$", ""
        );

        // Remove page numbers like "Page X of Y"
        cleaned = cleaned.replaceAll("(?m)^\\s*Page \\d+ of \\d+\\s*$", "");

        // Replace 3 or more consecutive newlines with just 2 newlines
        cleaned = cleaned.replaceAll("\\n{3,}", "\n\n");

        // Trim the final result
        return cleaned.trim();
    }

    // 4. Validate if the document is an SDD
    public static boolean isLikelySDD(String content)
    {
        String lower = content.toLowerCase();

        return lower.contains("introduction") &&
               lower.contains("architectural design") &&
               lower.contains("detailed design");
    }

    // 5. Convert cleaned content to JSON
    public static String toStructuredJSON(String content, Map<Integer, Integer> imagesPerPage, Map<String, PageRange> sectionPages) throws IOException
    {
        String[] lines = content.split("\\n");
        Map<String, Object> root = new LinkedHashMap<>();

        // Title
        String title = extractTitle(content);
        root.put("Title", title);

        // Preface
        String preface = findBlock(lines, "preface", "introduction");
        root.put("Preface", preface); 

        // Introduction section
        Map<String, String> introduction = new LinkedHashMap<>();
        introduction.put("Purpose", findBlock(lines, "purpose", "scope"));
        introduction.put("Scope", findBlock(lines, "scope", "definitions"));
        introduction.put("Definitions and Acronyms", findBlock(lines, "definitions", "references"));
        introduction.put("References", findBlock(lines, "references", "architectural design"));
        root.put("Introduction", introduction);

        // Architectural Design section
        Map<String, Object> architecturalDesign = new LinkedHashMap<>();
        architecturalDesign.put("description", findBlock(lines, "architectural design", "detailed design"));
        
        // Check for block diagram
        boolean blockDiagramExists = false;
        if(sectionPages.containsKey("ArchitecturalDesign"))
        {
            blockDiagramExists = countImagesInRange(imagesPerPage, sectionPages.get("ArchitecturalDesign")) >= 1;
        }
        architecturalDesign.put("blockDiagramExists", blockDiagramExists);
        root.put("Architectural Design", architecturalDesign);

        // Detailed Design section
        Map<String, Object> detailed = new LinkedHashMap<>();
        parseModules(lines, detailed, imagesPerPage, sectionPages);
        root.put("Detailed Design", detailed);

        return new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(root);
    }
    
    private static int countImagesInRange(Map<Integer, Integer> imagesPerPage, PageRange range)
    {
        int totalImages = 0;
        for(Map.Entry<Integer, Integer> entry : imagesPerPage.entrySet())
        {
            if(range.containsPage(entry.getKey()))
            {
                totalImages += entry.getValue();
            }
        }
        return totalImages;
    }

    private static String extractTitle(String content)
    {
        Pattern titlePattern = Pattern.compile("(?i)software design description\\s+for\\s+(.+?)(?=\\s+submitted\\b|\\s+submitted by\\b|\\s+preface\\b|$)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = titlePattern.matcher(content);

        if (matcher.find())
        {
            String title = matcher.group(1).trim();
            title = title.replaceAll("\\s+", " ");
            return "Software Design Description for " + title;
        }

        return "Unknown Title";
    }

    private static String findBlock(String[] lines, String startKey, String nextKey)
    {
        StringBuilder sb = new StringBuilder();
        boolean inBlock = false;

        for(String line : lines)
        {
            String l = line.trim().toLowerCase();

            if(!inBlock && l.contains(startKey.toLowerCase()))
            {
                inBlock = true;
                continue;
            }

            if(inBlock && l.contains(nextKey.toLowerCase()))
            {
                break;
            }

            if(inBlock)
            {
                sb.append(line.trim()).append(" ");
            }
        }

        return sb.toString().trim();
    }

    private static void parseModules(String[] lines, Map<String, Object> detailed, Map<Integer, Integer> imagesPerPage, Map<String, PageRange> sectionPages)
    {
        Pattern modulePattern = Pattern.compile("module\\s+(\\d+)\\s*[:\\-]?\\s*(.+)", Pattern.CASE_INSENSITIVE);
        Pattern transactionPattern = Pattern.compile("(\\d+\\.\\d+)\\s+(.+)", Pattern.CASE_INSENSITIVE);

        String currentModule = null;
        String currentModuleNumber = null;
        Map<String, Object> currentModuleMap = null;
        Map<String, Object> currentTransaction = null;
        String currentTransactionNumber = null;
        String currentSection = null;
        StringBuilder frontendBuilder = null;
        StringBuilder backendBuilder = null;
        boolean hasExplicitTransaction = false;

        for(int i = 0; i < lines.length; i++)
        {
            String line = lines[i].trim();
            String lowerLine = line.toLowerCase();
            
            Matcher moduleMatcher = modulePattern.matcher(line);
            Matcher transactionMatcher = transactionPattern.matcher(line);

            // Check for module header
            if(moduleMatcher.find())
            {
                // Save previous module if exists
                if(currentModule != null && currentModuleMap != null)
                {
                    detailed.put(currentModule, currentModuleMap);
                }

                String moduleNumber = moduleMatcher.group(1);
                String moduleName = moduleMatcher.group(2).trim();
                currentModule = "Module " + moduleNumber + " " + moduleName;
                currentModuleNumber = moduleNumber;
                currentModuleMap = new LinkedHashMap<>();
                currentTransaction = null;
                currentTransactionNumber = null;
                currentSection = null;
                frontendBuilder = null;
                backendBuilder = null;
                hasExplicitTransaction = false;
            }
            // Check for transaction header (e.g., "1.1 User Login & Registration")
            else if(transactionMatcher.find() && currentModuleMap != null)
            {
                hasExplicitTransaction = true;
                String transactionNum = transactionMatcher.group(1);
                String transactionName = transactionMatcher.group(2).trim();
                String transactionKey = transactionNum + " " + transactionName;
                currentTransactionNumber = transactionNum;

                currentTransaction = new LinkedHashMap<>();
                
                // Build hierarchical key for image checking
                String transactionImageKey = "Module_" + currentModuleNumber + "_Transaction_" + transactionNum;
                
                // Check if transaction has at least 4 images (UI, Class, Sequence, ERD)
                boolean hasAllImages = false;
                if(sectionPages.containsKey(transactionImageKey))
                {
                    int imageCount = countImagesInRange(imagesPerPage, sectionPages.get(transactionImageKey));
                    hasAllImages = imageCount >= 4;
                    System.out.println("Transaction " + transactionKey + " has " + imageCount + " images - hasAllImages: " + hasAllImages);
                }
                else
                {
                    System.out.println("Transaction " + transactionKey + " - no page range found");
                }
                currentTransaction.put("hasAllImages", hasAllImages);
                
                currentTransaction.put("frontendComponents", "");
                currentTransaction.put("backendComponents", "");

                currentModuleMap.put(transactionKey, currentTransaction);
                currentSection = null;
                frontendBuilder = new StringBuilder();
                backendBuilder = new StringBuilder();
            }
            // Check for section headers within a transaction
            else if(currentModuleMap != null)
            {
                // If we haven't found an explicit transaction yet and we encounter component sections,
                // create an implicit transaction
                if(!hasExplicitTransaction && currentTransaction == null && 
                (lowerLine.contains("user interface design") || 
                    lowerLine.contains("front-end component") || 
                    lowerLine.contains("frontend component") ||
                    lowerLine.contains("back-end component") || 
                    lowerLine.contains("backend component")))
                {
                    hasExplicitTransaction = true; // Prevent creating multiple implicit transactions
                    currentTransaction = new LinkedHashMap<>();
                    
                    // For implicit transactions, we don't have a transaction number, so we can't check images
                    currentTransaction.put("hasAllImages", false);
                    currentTransaction.put("frontendComponents", "");
                    currentTransaction.put("backendComponents", "");
                    
                    // Use module name as transaction key for modules without explicit transactions
                    String transactionKey = currentModule.replaceAll("^Module \\d+ ", "");
                    currentModuleMap.put(transactionKey, currentTransaction);
                    currentSection = null;
                    frontendBuilder = new StringBuilder();
                    backendBuilder = new StringBuilder();
                }

                if(currentTransaction != null)
                {
                    // Check for Frontend section
                    if(lowerLine.contains("front-end component") || lowerLine.contains("frontend component"))
                    {
                        currentSection = "frontend";
                    }
                    // Check for Backend section
                    else if(lowerLine.contains("back-end component") || lowerLine.contains("backend component"))
                    {
                        currentSection = "backend";
                        // Save frontend components before switching to backend
                        if(frontendBuilder != null && frontendBuilder.length() > 0)
                        {
                            currentTransaction.put("frontendComponents", frontendBuilder.toString().trim());
                        }
                    }
                    // Check for end of components section
                    else if(lowerLine.contains("object-oriented component") || 
                            lowerLine.contains("data design") ||
                            lowerLine.contains("user interface design") ||
                            transactionPattern.matcher(line).find() ||
                            modulePattern.matcher(line).find())
                    {
                        // Save backend components before ending section
                        if(backendBuilder != null && backendBuilder.length() > 0)
                        {
                            currentTransaction.put("backendComponents", backendBuilder.toString().trim());
                        }
                        currentSection = null;
                    }
                    // Extract component details
                    else if(currentSection != null && !line.isEmpty())
                    {
                        // Skip lines that are just markers (○, ●, ▪, etc.)
                        if(line.matches("^[○●▪■◦•]\\s*$"))
                        {
                            continue;
                        }
                        
                        // Clean up bullet points and add line to appropriate builder
                        String cleanLine = line.replaceAll("^[○●▪■◦•]\\s*", "").trim();
                        
                        if(!cleanLine.isEmpty())
                        {
                            if(currentSection.equals("frontend") && frontendBuilder != null)
                            {
                                if(frontendBuilder.length() > 0)
                                {
                                    frontendBuilder.append(" ");
                                }
                                frontendBuilder.append(cleanLine);
                            }
                            else if(currentSection.equals("backend") && backendBuilder != null)
                            {
                                if(backendBuilder.length() > 0)
                                {
                                    backendBuilder.append(" ");
                                }
                                backendBuilder.append(cleanLine);
                            }
                        }
                    }
                }
            }
        }

        // Save the last module
        if(currentModule != null && currentModuleMap != null)
        {
            detailed.put(currentModule, currentModuleMap);
        }
    }
}