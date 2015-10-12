/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package au.org.alfred.icu.nutrition.webservices.restful.service;

import au.org.alfred.icu.nutrition.webservices.restful.Review;
import au.org.alfred.icu.nutrition.webservices.restful.ReviewPK;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.PathSegment;

/**
 *
 * @author miguel
 */
@Stateless
@Path("au.org.alfred.icu.nutrition.webservices.restful.review")
public class ReviewFacadeREST extends AbstractFacade<Review> {
    @PersistenceContext(unitName = "au.org.alfred.icu.module_NutritionWeb_war_2.0.1PU")
    private EntityManager em;

    private ReviewPK getPrimaryKey(PathSegment pathSegment) {
        /*
         * pathSemgent represents a URI path segment and any associated matrix parameters.
         * URI path part is supposed to be in form of 'somePath;id=idValue;assesmentandplanID=assesmentandplanIDValue'.
         * Here 'somePath' is a result of getPath() method invocation and
         * it is ignored in the following code.
         * Matrix parameters are used as field names to build a primary key instance.
         */
        au.org.alfred.icu.nutrition.webservices.restful.ReviewPK key = new au.org.alfred.icu.nutrition.webservices.restful.ReviewPK();
        javax.ws.rs.core.MultivaluedMap<String, String> map = pathSegment.getMatrixParameters();
        java.util.List<String> id = map.get("id");
        if (id != null && !id.isEmpty()) {
            key.setId(new java.lang.Long(id.get(0)));
        }
        java.util.List<String> assesmentandplanID = map.get("assesmentandplanID");
        if (assesmentandplanID != null && !assesmentandplanID.isEmpty()) {
            key.setAssesmentandplanID(new java.lang.Long(assesmentandplanID.get(0)));
        }
        return key;
    }

    public ReviewFacadeREST() {
        super(Review.class);
    }

    @POST
    @Override
    @Consumes({"application/xml", "application/json"})
    public void create(Review entity) {
        super.create(entity);
    }

    @PUT
    @Path("{id}")
    @Consumes({"application/xml", "application/json"})
    public void edit(@PathParam("id") PathSegment id, Review entity) {
        super.edit(entity);
    }

    @DELETE
    @Path("{id}")
    public void remove(@PathParam("id") PathSegment id) {
        au.org.alfred.icu.nutrition.webservices.restful.ReviewPK key = getPrimaryKey(id);
        super.remove(super.find(key));
    }

    @GET
    @Path("{id}")
    @Produces({"application/xml", "application/json"})
    public Review find(@PathParam("id") PathSegment id) {
        au.org.alfred.icu.nutrition.webservices.restful.ReviewPK key = getPrimaryKey(id);
        return super.find(key);
    }
    
     @GET
    @Path("/anp/{id}")
    @Produces({"application/xml", "application/json"})
    @Override
    public List<Review> findForANPId(@PathParam("id") String id) {
        return super.findForANPId(id);
    }

    @GET
    @Override
    @Produces({"application/xml", "application/json"})
    public List<Review> findAll() {
        return super.findAll();
    }

    @GET
    @Path("{from}/{to}")
    @Produces({"application/xml", "application/json"})
    public List<Review> findRange(@PathParam("from") Integer from, @PathParam("to") Integer to) {
        return super.findRange(new int[]{from, to});
    }

    @GET
    @Path("count")
    @Produces("text/plain")
    public String countREST() {
        return String.valueOf(super.count());
    }

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }
    
}
