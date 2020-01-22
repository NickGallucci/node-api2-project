const express = require('express');

const router = express.Router();

const Posts = require('../data/db.js');

router.get('/', (req, res) => {
    Posts.find()
    .then((postsData) => {
        res.status(200).json({postsData})
    })
    .catch((error) => {
        console.log('get posts error', error)
        res.status(500).json({ error: 'The post information could not be retrieved.' })
    })
});

router.get('/:id', (req, res) => {
    const id = req.params.id
    Posts.findById(id)
    .then(post => {
        if(!post || (post === null) || (post === undefined)){
            res.status(404).json({ error: 'The post with an id of ${id} could not be found.' })
        } else {
            res.status(200).json(post)
        }
    })
    .catch((error) => {
        console.log('get posts error', error)
        res.status(500).json({ error: 'The posts information could not be retrieved.' })
    })
});

router.get('/:id/comments', (req, res) => {
    const id = req.params.id
    Posts.findById(id)
    .then(post => {
        if(!post){
            res.status(404).json({ error: 'The post with an id of ${id} could not be found.' })
        } else {
            Posts.findPostComments(id)
            .then((comments) => {
                if(!comments){
                    res.status(404).json({ error: 'Can not find the comment.' })
                } else {
                    res.status(200).json(comments)
                }
            })
        }
    })
    .catch((error) => {
        console.log('get posts error', error)
        res.status(500).json({ error: 'The post comments informatiojn could not be retrieved.' })
    })
});

router.post('/', (req, res) => {
    const postData = req.body
    if(!postData.title || !postData.contents){
        res.status(400).json({ error: 'Title and contents are both required.' })
    } else {
        Posts.insert(postData)
        .then((postRes) => {
            res.status(201).json(postRes)
        })
    }
});

router.post('/:id/comments', (req, res) => {
    const commentData = req.body
    const id = req.params.id
    if(!commentData.text){
        res.status(400).json({ error: 'Comment text is required!' })
    } else {
        Posts.findById(id)
        .then(post => {
            if(!post){
                res.status(404).json({ error: 'Comment failed because post was not found.' })
            } else {
                Posts.insertComment(commentData)
                .then((commentRes) => {
                    res.status(201).json(commentRes)
                })
                .catch(error => {
                    console.log('Comment error', error)
                    res.status(500).json({ error: 'Failed to make a comment.' })
                })
            }
        })
        .catch(error => {
            console.log('Error getting post to make a comment', error)
            res.status(500).json({ error: 'Failed to get post to make a comment.' })
        })
    }
});

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Posts.remove(id)
    .then(post => {
        if(!post){
            res.status(404).json({ error: 'No post was found to delete.' })
        } else {
            res.status(200).json(post)
        }
    })
    .catch(error => {
        console.log('Delete error', error)
    })
})

router.put('/:id', (req, res) => {
    const id = req.params.id
    const putData = req.body
    if(!putData.title || !putData.contents){
        res.status(400).json({ error: 'Needs both the title and contents.' })
    }
    Posts.findById(id)
    .then(post => {
        if(!post){
            res.status(404).json({error: 'no post found to update'})
        } else {
            Posts.update(id, putData)
                .then(updated=>{
                    res.status(201).json(updated)
                })
                .catch(err=>{
                    console.log('update error', err)
                    res.status(500).json({error: 'failed to save update'})
                })
        }
    })
    .catch(err=>{
        console.log('failed to get post to update', err)
        res.status(500).json({error: 'failed to get post to update'})
    })
})

module.exports = router