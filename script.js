import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// Define the servlet and map it to the /menu endpoint
@WebServlet("/menu")
public class MenuServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // HTML header and styling
        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("<meta charset='UTF-8'>");
        out.println("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        out.println("<title>Menu - Kabul Restaurant</title>");
        out.println("<link rel='stylesheet' href='styles.css'>");
        out.println("<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'>");
        out.println("</head>");
        out.println("<body>");
        out.println("<header class='header'>");
        out.println("<div class='logo'><h1><span>Kabul</span> Restaurant</h1></div>");
        out.println("<nav class='navbar'>");
        out.println("<ul>");
        out.println("<li><a href='index.html'>Home</a></li>");
        out.println("<li><a href='menu' class='active'>Menu</a></li>");
        out.println("<li><a href='book.html'>Book a Reservation</a></li>");
        out.println("</ul>");
        out.println("</nav>");
        out.println("</header>");
        out.println("<section class='menu-section'><div class='container'><h2 class='menu-title'>Our Menu</h2>");

        try {
            // Database connection
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/kabul_restaurant", "root", "password");

            // Query for menu items
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT category, name, description, price, image FROM menu_items ORDER BY category");

            String currentCategory = "";
            while (rs.next()) {
                String category = rs.getString("category");
                String name = rs.getString("name");
                String description = rs.getString("description");
                String price = rs.getString("price");
                String image = rs.getString("image");

                // Print category header if it's new
                if (!category.equals(currentCategory)) {
                    if (!currentCategory.isEmpty()) {
                        out.println("</div>"); // Close previous category div
                    }
                    out.println("<div class='menu-category'><h3>" + category + "</h3><div class='menu-items'>");
                    currentCategory = category;
                }

                // Print menu item
                out.println("<div class='menu-item'>");
                out.println("<img src='" + image + "' alt='" + name + "'>");
                out.println("<h4>" + name + "</h4>");
                out.println("<p>" + description + "</p>");
                out.println("<span>$" + price + "</span>");
                out.println("</div>");
            }

            out.println("</div></div></section>"); // Close last category and container
            rs.close();
            stmt.close();
            conn.close();
        } catch (Exception e) {
            out.println("<p>Error loading menu: " + e.getMessage() + "</p>");
        }

        // Footer
        out.println("<footer class='footer'>");
        out.println("<div class='footer-container'>");
        out.println("<div class='footer-contact'>");
        out.println("<h3>Contact Us</h3>");
        out.println("<p>123 Future Street, City Name, Country</p>");
        out.println("<p>Phone: +123 456 7890</p>");
        out.println("<p>Email: contact@restaurant.com</p>");
        out.println("</div>");
        out.println("<div class='footer-map'>");
        out.println("<h3>Our Location</h3>");
        out.println("<iframe src='https://www.google.com/maps/embed?pb=...' width='100%' height='300' style='border:0;' allowfullscreen='' loading='lazy'></iframe>");
        out.println("</div>");
        out.println("<div class='footer-social'>");
        out.println("<h3>Follow Us</h3>");
        out.println("<a href='https://facebook.com' target='_blank'><i class='fab fa-facebook-f'></i></a>");
        out.println("<a href='https://instagram.com' target='_blank'><i class='fab fa-instagram'></i></a>");
        out.println("</div>");
        out.println("</div>");
        out.println("<div class='footer-copy'>");
        out.println("<p>&copy; Kabul Restaurant. All rights reserved.</p>");
        out.println("</div>");
        out.println("</footer>");
        out.println("</body></html>");
    }
}
